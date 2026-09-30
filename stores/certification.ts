import { defineStore } from 'pinia';
import { seedProjects } from '~/data/seed';
import { certificationApi } from '~/services/certification-api';
import {
  baselineLabel,
  invalidateReviewForBaselineChange,
  reconcilePackage,
  recomputeRegulations
} from '~/services/reconcile';
import type {
  ApprovalProject,
  AuditEntry,
  EvidenceItem,
  EvidenceStatus,
  ImportSession,
  ProjectConflict,
  ProjectInput,
  ProjectStatus,
  ProjectVersion,
  ReconcileDecision,
  ReconcileLine,
  ReviewDecision,
  SupplementPackage
} from '~/types/certification';

const STORAGE_KEY = 'vehicle-type-approval-projects-v1';
const SESSION_KEY = 'vehicle-type-approval-import-sessions-v1';
const MAX_UPLOAD_ATTEMPTS = 4;

function cloneSeed() {
  return structuredClone(seedProjects);
}

function makeId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function audit(actor: string, action: string, detail: string, dedupKey?: string): AuditEntry {
  return { id: makeId('AUD'), actor, action, detail, createdAt: nowIso(), dedupKey };
}

/** 幂等写入审计：同一业务事件重复提交不产生第二条记录 */
function pushAudit(project: ApprovalProject, entry: AuditEntry) {
  if (entry.dedupKey && project.audit.some((item) => item.dedupKey === entry.dedupKey)) return false;
  project.audit.unshift(entry);
  return true;
}

function assertMutable(project: ApprovalProject) {
  if (project.status === 'approved') {
    throw new Error(`项目 ${project.id} 已批准，冻结快照不可改写；如需变更请先建立变更项目。`);
  }
}

/** 按当前证据刷新法规覆盖 */
function refreshRegulations(project: ApprovalProject) {
  project.regulations = recomputeRegulations(project.regulations, project.evidence, project.softwareVersion);
}

function findPackageLine(pkg: SupplementPackage, key: string) {
  return pkg.items.find((item) => (item.evidenceId ?? `${item.regulationId}:${item.name}`) === key);
}

function upsertConflict(project: ApprovalProject, candidate: ProjectConflict) {
  const existing = project.conflicts.find(
    (item) =>
      item.kind === candidate.kind &&
      item.evidenceId === candidate.evidenceId &&
      item.packageId === candidate.packageId
  );
  if (existing) return existing;
  project.conflicts.push(candidate);
  return candidate;
}

export interface ConfirmOutcome {
  ok: boolean;
  partial?: boolean;
  applied: number;
  remaining: number;
  error?: string;
}

export const useCertificationStore = defineStore('certification', {
  state: () => ({
    projects: cloneSeed() as ApprovalProject[],
    importSessions: [] as ImportSession[],
    hydrated: false
  }),

  getters: {
    projectById: (state) => (id: string) => state.projects.find((project) => project.id === id),
    agencies: (state) => Array.from(new Set(state.projects.map((project) => project.agency))).sort(),
    sessionById: (state) => (id: string) => state.importSessions.find((session) => session.id === id),
    resumableSessions: (state) =>
      state.importSessions.filter(
        (session) => session.status === 'awaiting_confirmation' || session.status === 'failed'
      ),
    expiringEvidence: (state) =>
      state.projects.flatMap((project) =>
        project.evidence
          .filter((item) => item.expiryDate)
          .map((item) => ({ project, evidence: item }))
          .filter(({ evidence }) => new Date(evidence.expiryDate!) <= new Date('2027-01-31'))
      )
  },

  actions: {
    hydrate() {
      if (this.hydrated || typeof localStorage === 'undefined') return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const projects = JSON.parse(raw) as ApprovalProject[];
          this.projects = projects.map((project) => ({
            ...project,
            audit: project.audit ?? [],
            conflicts: project.conflicts ?? []
          }));
        }
        const sessionsRaw = localStorage.getItem(SESSION_KEY);
        if (sessionsRaw) this.importSessions = JSON.parse(sessionsRaw) as ImportSession[];
      } catch {
        this.projects = cloneSeed();
        this.importSessions = [];
      }
      this.hydrated = true;
    },

    persist() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects));
      }
    },

    persistSessions() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(this.importSessions));
      }
    },

    createProject(input: ProjectInput) {
      const createdAt = nowIso();
      const project: ApprovalProject = {
        id: `TA-${new Date().getFullYear()}-${String(this.projects.length + 121).padStart(3, '0')}`,
        ...input,
        status: 'draft',
        progress: 18,
        reviewer: '待分派',
        updatedAt: createdAt,
        regulations: [
          {
            id: 'REG-BRAKE',
            code: 'GB 21670',
            title: '乘用车制动系统技术要求',
            category: '安全',
            required: true,
            status: 'missing',
            coverage: 0,
            issues: ['尚未关联测试报告']
          },
          {
            id: 'REG-EMC',
            code: 'GB 34660',
            title: '道路车辆电磁兼容性要求',
            category: '环保',
            required: true,
            status: 'missing',
            coverage: 0,
            issues: ['尚未关联测试报告']
          }
        ],
        evidence: [],
        versions: [
          {
            id: makeId('VER'),
            label: `${input.maintenanceVersion} / ${input.softwareVersion}`,
            author: input.applicant,
            createdAt,
            summary: '创建认证证据包草稿。',
            changes: ['录入车型、配置和维护版本', '建立基础法规项'],
            impactedConfigurations: [input.configuration]
          }
        ],
        audit: [audit(input.applicant, '建立项目', '创建型式认证证据包草稿。')],
        conflicts: []
      };
      this.projects.unshift(project);
      this.persist();
      return project.id;
    },

    /** 更新项目资料；软件基线变化时已有审阅结论一律失效，法规覆盖同步重算 */
    updateProject(id: string, input: ProjectInput, reason: string, actor?: string) {
      const project = this.projects.find((item) => item.id === id);
      if (!project) return false;
      assertMutable(project);

      const previous = {
        maintenanceVersion: project.maintenanceVersion,
        softwareVersion: project.softwareVersion,
        configuration: project.configuration
      };
      const previousBaseline = baselineLabel(previous.maintenanceVersion, previous.softwareVersion);
      const at = nowIso();

      Object.assign(project, input, { updatedAt: at });

      const changed: string[] = [];
      if (previous.maintenanceVersion !== input.maintenanceVersion) changed.push('维护版本');
      if (previous.softwareVersion !== input.softwareVersion) changed.push('软件版本');
      if (previous.configuration !== input.configuration) changed.push('配置范围');

      if (changed.length) {
        const version: ProjectVersion = {
          id: makeId('VER'),
          label: `${input.maintenanceVersion} / ${input.softwareVersion}`,
          author: actor ?? project.applicant,
          createdAt: at,
          summary: `更新${changed.join('、')}：${reason}`,
          changes: changed,
          impactedConfigurations: [input.configuration]
        };
        project.versions.unshift(version);
        project.audit.unshift(
          audit(
            actor ?? project.applicant,
            '更新项目版本',
            `${changed.join('、')}；影响配置：${input.configuration}`,
            undefined
          )
        );
      } else {
        project.audit.unshift(audit(actor ?? project.applicant, '更新项目资料', reason));
      }

      // 软件基线一变：已有审阅结果失效、登记基线漂移冲突、覆盖重算
      if (previous.softwareVersion !== input.softwareVersion) {
        const before = project.evidence.length;
        project.evidence = invalidateReviewForBaselineChange(
          project.evidence,
          previousBaseline,
          input.softwareVersion,
          at
        );
        const invalidated = project.evidence.filter((item) => item.status === 'stale');
        invalidated.forEach((item) => {
          upsertConflict(project, {
            id: makeId('CFL'),
            kind: 'baseline_drift',
            evidenceId: item.id,
            evidenceName: item.name,
            description: `软件基线由 ${previous.softwareVersion} 变更为 ${input.softwareVersion}，原 ${item.reviewDecision ?? '审阅'} 结论失效，须在新基线下重新确认`,
            createdAt: at,
            resolved: false
          });
        });
        refreshRegulations(project);
        pushAudit(
          project,
          audit(
            actor ?? project.applicant,
            '软件基线变更',
            `软件基线 ${previous.softwareVersion} → ${input.softwareVersion}；${invalidated.length}/${before} 项已有审阅结论失效，等待重新确认。`
          )
        );
      }

      this.persist();
      return true;
    },

    transition(id: string, status: ProjectStatus, actor: string, reason: string) {
      const project = this.projects.find((item) => item.id === id);
      if (!project) return false;
      if (project.status === 'approved' && status !== 'approved') {
        throw new Error(`项目 ${id} 已批准冻结，不能改变审批状态；如需变更请建立新的变更项目。`);
      }
      project.status = status;
      if (status === 'submitted') project.submittedAt = nowIso().slice(0, 10);
      if (status === 'approved') {
        project.progress = 100;
        // 批准即冻结：快照独立持有，后续任何写入都触碰不到
        project.frozenSnapshot = {
          frozenAt: nowIso(),
          maintenanceVersion: project.maintenanceVersion,
          softwareVersion: project.softwareVersion,
          configuration: project.configuration,
          regulations: structuredClone(project.regulations),
          evidence: structuredClone(project.evidence)
        };
      }
      if (status === 'supplement_required') project.progress = Math.min(project.progress, 82);
      project.updatedAt = nowIso();
      project.audit.unshift(audit(actor, '审批状态流转', `${status}；${reason}`));
      this.persist();
      return true;
    },

    /** 逐项审阅；对 stale 证据的接受/拒绝属于"按当前基线重新确认"，会解除失效与漂移冲突 */
    updateEvidence(projectId: string, evidenceId: string, status: EvidenceStatus, note: string) {
      const project = this.projects.find((item) => item.id === projectId);
      const evidence = project?.evidence.find((item) => item.id === evidenceId);
      if (!project || !evidence) return false;
      assertMutable(project);

      const wasStale = evidence.status === 'stale';
      const at = nowIso();
      evidence.status = status;
      if (note) evidence.note = note;
      evidence.updatedAt = at;

      if (status === 'accepted' || status === 'rejected') {
        evidence.reviewDecision = status as ReviewDecision;
        evidence.reviewedBaseline = baselineLabel(project.maintenanceVersion, project.softwareVersion);
        evidence.reviewedAt = at;
        evidence.invalidatedAt = undefined;
      }

      project.updatedAt = at;

      if (wasStale && (status === 'accepted' || status === 'rejected' || status === 'resubmit')) {
        let resolved = 0;
        project.conflicts.forEach((conflict) => {
          if (conflict.kind === 'baseline_drift' && conflict.evidenceId === evidenceId && !conflict.resolved) {
            conflict.resolved = true;
            conflict.resolvedAt = at;
            resolved += 1;
          }
        });
        pushAudit(
          project,
          audit(
            project.reviewer,
            '基线变更后重新确认',
            `${evidence.name} 在基线 ${project.softwareVersion} 下重新确认为 ${status}${resolved ? `，关闭 ${resolved} 条基线漂移冲突` : ''}。`
          )
        );
      } else {
        project.audit.unshift(audit(project.reviewer, '更新证据状态', `${evidence.name}：${status}`));
      }

      refreshRegulations(project);
      this.persist();
      return true;
    },

    bulkSupplement(projectId: string, evidenceIds: string[], note: string) {
      const project = this.projects.find((item) => item.id === projectId);
      if (!project) return 0;
      assertMutable(project);
      let count = 0;
      const at = nowIso();
      project.evidence.forEach((evidence) => {
        if (!evidenceIds.includes(evidence.id)) return;
        evidence.status = 'submitted';
        evidence.softwareVersion = project.softwareVersion;
        evidence.note = note;
        evidence.updatedAt = at;
        count += 1;
      });
      if (count) {
        project.progress = Math.min(95, project.progress + count * 4);
        project.updatedAt = at;
        project.audit.unshift(
          audit(project.applicant, '批量补件', `${count} 项证据更新至 ${project.softwareVersion}。${note}`)
        );
        refreshRegulations(project);
        this.persist();
      }
      return count;
    },

    /* ---------------- 离线补件包导入 / 对账 ---------------- */

    /**
     * 导入离线补件包：
     * - 传输失败立即用同一补件包重试（同一 packageId / 快照）；
     * - 同一补件包重复提交复用既有会话，已确认的不产生第二套会话与审计；
     * - 传输成功后按证据版本逐项对账，等待审阅人确认。
     */
    async startImport(pkg: SupplementPackage): Promise<ImportSession> {
      const project = this.projects.find((item) => item.id === pkg.projectId);
      if (!project) throw new Error('补件包对应的认证项目不存在');
      assertMutable(project);

      const existing = this.importSessions.find((session) => session.packageId === pkg.packageId);
      if (existing) {
        if (existing.status === 'confirmed') {
          return { ...existing, duplicated: true };
        }
        if (existing.status === 'awaiting_confirmation' || existing.status === 'failed' || existing.status === 'comparing') {
          return existing;
        }
      }

      const at = nowIso();
      const session: ImportSession = existing ?? {
        id: makeId('IMP'),
        packageId: pkg.packageId,
        projectId: pkg.projectId,
        reviewer: pkg.reviewer,
        exportedAt: pkg.exportedAt,
        baselineAtExport: pkg.baseline,
        status: 'comparing',
        lines: [],
        packageSnapshot: structuredClone(pkg),
        draftDecisions: {},
        transportAttempts: 0,
        createdAt: at,
        updatedAt: at
      };
      if (!existing) this.importSessions.unshift(session);
      session.packageSnapshot = structuredClone(pkg);
      session.lastError = undefined;

      return this.runUpload(session);
    },

    /** 失败后用同一补件包立即/再次重试，已上传成功的对账结果不重做 */
    async retryImport(sessionId: string): Promise<ImportSession> {
      const session = this.importSessions.find((item) => item.id === sessionId);
      if (!session) throw new Error('导入会话不存在');
      return this.runUpload(session);
    },

    async runUpload(session: ImportSession): Promise<ImportSession> {
      const project = this.projects.find((item) => item.id === session.projectId);
      if (!project) throw new Error('认证项目不存在');
      assertMutable(project);

      session.status = 'comparing';
      session.updatedAt = nowIso();
      this.persistSessions();

      let lastError = '';
      while (session.transportAttempts < MAX_UPLOAD_ATTEMPTS) {
        session.transportAttempts += 1;
        session.updatedAt = nowIso();
        this.persistSessions();
        try {
          await certificationApi.uploadSupplementPackage(session.projectId, session.packageSnapshot);
          // 传输成功：按当前项目逐项比较（重试期间基线可能又被改动，这里取最新）
          session.lines = reconcilePackage(project, session.packageSnapshot);
          session.status = 'awaiting_confirmation';
          session.lastError = undefined;
          session.updatedAt = nowIso();
          this.persistSessions();
          return session;
        } catch (error) {
          lastError = error instanceof Error ? error.message : '回网链路中断';
          session.lastError = lastError;
          session.updatedAt = nowIso();
          this.persistSessions();
          // 立即用同一补件包重试，循环内不等待人工介入
        }
      }

      session.status = 'failed';
      session.lastError = `${lastError}；已用同一补件包重试 ${session.transportAttempts} 次，可在页面安全点再次重试。`;
      session.updatedAt = nowIso();
      this.persistSessions();
      return session;
    },

    /** 暂存审阅人的逐项选择，构成页面重开后可继续的安全点 */
    saveImportDraft(sessionId: string, decisions: Record<string, ReconcileDecision>) {
      const session = this.importSessions.find((item) => item.id === sessionId);
      if (!session) return;
      session.draftDecisions = { ...decisions };
      session.updatedAt = nowIso();
      this.persistSessions();
    },

    abandonImport(sessionId: string) {
      const session = this.importSessions.find((item) => item.id === sessionId);
      if (!session || session.status === 'confirmed') return;
      session.status = 'abandoned';
      session.updatedAt = nowIso();
      this.persistSessions();
    },

    /**
     * 确认对账结果：
     * - 确认时一次写入全部变化（项目证据、覆盖、冲突、版本在同一事务内提交）；
     * - 中途断连只保留已落库行的安全点，重试不重做已确认部分；
     * - 整次导入只写一条幂等审计。
     */
    async confirmImport(sessionId: string): Promise<ConfirmOutcome> {
      const session = this.importSessions.find((item) => item.id === sessionId);
      if (!session) return { ok: false, applied: 0, remaining: 0, error: '导入会话不存在' };
      const project = this.projects.find((item) => item.id === session.projectId);
      if (!project) return { ok: false, applied: 0, remaining: 0, error: '认证项目不存在' };
      assertMutable(project);

      if (session.status === 'confirmed') {
        return { ok: true, applied: 0, remaining: 0 };
      }

      // 以当前项目重新对账，保留已应用标记与暂存选择
      const appliedByKey = new Map(session.lines.map((line) => [line.key, Boolean(line.applied)]));
      const freshLines = reconcilePackage(project, session.packageSnapshot);
      session.lines = freshLines.map((line) => ({
        ...line,
        applied: appliedByKey.get(line.key) ?? false
      }));

      const pending = session.lines.filter((line) => !line.applied);
      if (!pending.length) {
        return this.finalizeImport(session, project);
      }

      // 注入式中途断连：第一次确认只落一部分行（安全点），传输随即失败
      const simulatePartial = Boolean(session.packageSnapshot.failConfirmOnce) && !session.partialFailureConsumed;
      const batch = simulatePartial ? pending.slice(0, Math.max(1, Math.ceil(pending.length / 2))) : pending;

      batch.forEach((line) => {
        const decision = session.draftDecisions[line.key] ?? line.defaultDecision;
        this.applyReconcileLine(project, session.packageSnapshot, line, decision);
        line.applied = true;
      });

      if (simulatePartial) {
        session.partialFailureConsumed = true;
      }

      refreshRegulations(project);
      project.updatedAt = nowIso();
      this.persist();
      session.updatedAt = nowIso();
      this.persistSessions();

      try {
        await certificationApi.confirmImportSession(
          session.id,
          simulatePartial ? 1 : 0
        );
      } catch (error) {
        session.status = 'failed';
        session.lastError = error instanceof Error ? error.message : '确认写入中途断连';
        this.persistSessions();
        return {
          ok: false,
          partial: batch.length < pending.length,
          applied: batch.length,
          remaining: pending.length - batch.length,
          error: session.lastError
        };
      }

      if (batch.length < pending.length) {
        // 已落部分行，继续完成剩余行（同一确认事务的延续，不重复审计）
        return this.confirmImport(sessionId);
      }

      return this.finalizeImport(session, project);
    },

    /** 按决定把一条对账结果落到项目证据上（结论分歧保留当前时不改证据） */
    applyReconcileLine(
      project: ApprovalProject,
      pkg: SupplementPackage,
      line: ReconcileLine,
      decision: ReconcileDecision
    ) {
      const pkgItem = findPackageLine(pkg, line.key);
      if (!pkgItem) return;
      const at = nowIso();
      const currentBaseline = baselineLabel(project.maintenanceVersion, project.softwareVersion);
      const baselineChanged = line.outcome === 'reconfirm';

      const adoptContent = (evidence: EvidenceItem) => {
        evidence.regulationId = pkgItem.regulationId;
        evidence.name = pkgItem.name;
        evidence.type = pkgItem.type;
        evidence.version = pkgItem.version;
        evidence.configurations = [...pkgItem.configurations];
        evidence.note = pkgItem.note;
        evidence.updatedAt = at;
      };

      if (decision === 'keep_current') {
        return;
      }

      const existing = line.matchedEvidenceId
        ? project.evidence.find((item) => item.id === line.matchedEvidenceId)
        : undefined;

      if (existing) {
        adoptContent(existing);
        if (baselineChanged) {
          // 内容可合并，但离线结论在漂移基线上无效：保持失效/待审，等待当前审阅人重认
          existing.softwareVersion = project.softwareVersion;
          if (existing.status === 'accepted' || existing.status === 'rejected' || existing.status === 'stale') {
            existing.status = 'stale';
            existing.reviewDecision = existing.reviewDecision ?? (existing.status as ReviewDecision);
            existing.reviewedBaseline = existing.reviewedBaseline ?? currentBaseline;
            existing.invalidatedAt = at;
          } else {
            existing.status = 'submitted';
          }
        } else {
          existing.softwareVersion = pkgItem.softwareVersion;
          existing.status = pkgItem.status;
          if (pkgItem.status === 'accepted' || pkgItem.status === 'rejected') {
            existing.reviewDecision = pkgItem.status as ReviewDecision;
            existing.reviewedBaseline = currentBaseline;
            existing.reviewedAt = at;
            existing.invalidatedAt = undefined;
          }
        }
        return;
      }

      // 新增证据：漂移基线下一律进入待审，不直接接受离线结论
      const evidence: EvidenceItem = {
        id: makeId('EV'),
        projectId: project.id,
        regulationId: pkgItem.regulationId,
        name: pkgItem.name,
        type: pkgItem.type,
        version: pkgItem.version,
        softwareVersion: baselineChanged ? project.softwareVersion : pkgItem.softwareVersion,
        configurations: [...pkgItem.configurations],
        status: baselineChanged ? 'submitted' : pkgItem.status,
        note: pkgItem.note,
        updatedAt: at
      };
      if (!baselineChanged && (pkgItem.status === 'accepted' || pkgItem.status === 'rejected')) {
        evidence.reviewDecision = pkgItem.status as ReviewDecision;
        evidence.reviewedBaseline = currentBaseline;
        evidence.reviewedAt = at;
      }
      project.evidence.push(evidence);
      line.matchedEvidenceId = evidence.id;
    },

    /** 全部行落库后的统一收尾：冲突登记 + 单条幂等审计 + 会话关闭 */
    async finalizeImport(session: ImportSession, project: ApprovalProject): Promise<ConfirmOutcome> {
      const at = nowIso();
      const counts = {
        safe_update: 0,
        add_evidence: 0,
        reconfirm: 0,
        review_conflict: 0,
        keep_current: 0,
        unchanged: 0
      } as Record<ReconcileLine['outcome'], number>;

      session.lines.forEach((line) => {
        counts[line.outcome] += 1;
        const decision = session.draftDecisions[line.key] ?? line.defaultDecision;
        const pkgItem = findPackageLine(session.packageSnapshot, line.key);

        if (line.outcome === 'review_conflict') {
          const evidenceId = line.matchedEvidenceId;
          if (decision === 'apply_package') {
            // 审阅人显式采用补件包结论：记录为"已解决"分歧，默认路径不会走到这里
            upsertConflict(project, {
              id: makeId('CFL'),
              kind: 'review_divergence',
              evidenceId,
              evidenceName: line.name,
              description: `同版本审阅分歧：当前 ${line.currentDecision}，补件包 ${line.packageDecision}；审阅人显式采用补件包结论`,
              packageId: session.packageId,
              createdAt: at,
              resolved: true,
              resolvedAt: at
            });
          } else {
            // 默认保留当前审阅，后到结果不得覆盖，登记未解决分歧
            upsertConflict(project, {
              id: makeId('CFL'),
              kind: 'review_divergence',
              evidenceId,
              evidenceName: line.name,
              description: `同版本审阅分歧：当前为 ${line.currentDecision}，补件包后到结论为 ${line.packageDecision}；已保留当前审阅${pkgItem ? `（包内意见：${pkgItem.note}）` : ''}`,
              packageId: session.packageId,
              createdAt: at,
              resolved: false
            });
          }
        }

        if (line.outcome === 'reconfirm' && line.matchedEvidenceId) {
          const evidence = project.evidence.find((item) => item.id === line.matchedEvidenceId);
          if (evidence?.status === 'stale') {
            upsertConflict(project, {
              id: makeId('CFL'),
              kind: 'baseline_drift',
              evidenceId: evidence.id,
              evidenceName: evidence.name,
              description: `补件包按基线 ${session.baselineAtExport.softwareVersion} 离线审阅，当前基线为 ${project.softwareVersion}，结论失效待重新确认`,
              packageId: session.packageId,
              createdAt: at,
              resolved: false
            });
          }
        }
      });

      refreshRegulations(project);
      project.updatedAt = at;

      const summary =
        `补件包 ${session.packageId} 对账确认：安全更新 ${counts.safe_update} 项，新增 ${counts.add_evidence} 项，` +
        `基线漂移待重认 ${counts.reconfirm} 项，审阅分歧保留当前 ${counts.review_conflict} 项，` +
        `无变化 ${counts.unchanged} 项。`;
      pushAudit(
        project,
        audit(session.reviewer, '确认离线补件导入', summary, `import-confirm:${session.id}`)
      );

      session.status = 'confirmed';
      session.confirmedAt = at;
      session.updatedAt = at;
      const auditEntry = project.audit.find((item) => item.dedupKey === `import-confirm:${session.id}`);
      if (auditEntry) session.auditEntryId = auditEntry.id;

      this.persist();
      this.persistSessions();
      return { ok: true, applied: 0, remaining: 0 };
    },

    reset() {
      this.projects = cloneSeed();
      this.importSessions = [];
      this.persist();
      this.persistSessions();
    }
  }
});
