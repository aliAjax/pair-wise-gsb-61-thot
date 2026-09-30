import { defineStore } from 'pinia';
import { seedProjects } from '~/data/seed';
import {
  checksum,
  frozenSnapshotPayload,
  isFrozenSnapshotIntact,
  recomputeProjectCoverage
} from '~/services/reconcile';
import type {
  ApprovalProject,
  AuditEntry,
  EvidenceItem,
  ProjectInput,
  ProjectStatus,
  ProjectVersion,
  ReconcileCommitResult,
  ReconcileSession
} from '~/types/certification';

const STORAGE_KEY = 'vehicle-type-approval-projects-v1';

function cloneSeed() {
  return structuredClone(seedProjects);
}

function makeId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`;
}

function audit(actor: string, action: string, detail: string, packageId?: string): AuditEntry {
  return {
    id: makeId('AUD'),
    actor,
    action,
    detail,
    createdAt: new Date().toISOString(),
    packageId
  };
}

// 迁移历史本地数据：补全新增字段
function migrate(projects: ApprovalProject[]): ApprovalProject[] {
  projects.forEach((project) => {
    project.evidence.forEach((item) => {
      if (!item.reviewedSoftwareVersion) {
        // 已形成审阅结论的旧证据，其结论基线沿用证据自身标注的软件版本
        item.reviewedSoftwareVersion = ['accepted', 'rejected'].includes(item.status)
          ? item.softwareVersion
          : undefined;
      }
    });
    // 已批准但缺少冻结快照的历史数据，按当前内容补建并立即锁定
    if (project.status === 'approved' && !project.frozenSnapshot) {
      project.frozenSnapshot = {
        projectId: project.id,
        status: 'approved',
        maintenanceVersion: project.maintenanceVersion,
        softwareVersion: project.softwareVersion,
        frozenAt: project.updatedAt,
        frozenBy: project.reviewer,
        evidenceCount: project.evidence.length,
        checksum: checksum(frozenSnapshotPayload(project))
      };
    }
  });
  return projects;
}

export const useCertificationStore = defineStore('certification', {
  state: () => ({
    projects: migrate(cloneSeed()),
    hydrated: false
  }),

  getters: {
    projectById: (state) => (id: string) => state.projects.find((project) => project.id === id),
    agencies: (state) => Array.from(new Set(state.projects.map((project) => project.agency))).sort(),
    // 只有持有活动冻结快照的项目才禁止回写；已重新打开的项目仅保留历史快照
    isProjectFrozen: () => (project: ApprovalProject) => !!project.frozenSnapshot,
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
        if (raw) this.projects = migrate(JSON.parse(raw) as ApprovalProject[]);
      } catch {
        this.projects = cloneSeed();
      }
      this.hydrated = true;
    },

    persist() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects));
      }
    },

    // 已批准项目当前存在活动冻结快照：任何写动作都会改写已批准内容
    assertNotTampered(project: ApprovalProject): boolean {
      if (project.frozenSnapshot && !isFrozenSnapshotIntact(project)) return false;
      return true;
    },

    createProject(input: ProjectInput) {
      const createdAt = new Date().toISOString();
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
        audit: [audit(input.applicant, '建立项目', '创建型式认证证据包草稿。')]
      };
      this.projects.unshift(project);
      this.persist();
      return project.id;
    },

    updateProject(id: string, input: ProjectInput, reason: string) {
      const project = this.projects.find((item) => item.id === id);
      if (!project) return false;

      // 已批准项目的冻结快照不能被改写
      if (project.frozenSnapshot) {
        project.audit.unshift(
          audit(project.applicant, '拒绝基线变更', '项目已批准并冻结，基线与证据快照不可改写；如需变更请先重新打开审阅。')
        );
        this.persist();
        return false;
      }

      const previous = {
        maintenanceVersion: project.maintenanceVersion,
        softwareVersion: project.softwareVersion,
        configuration: project.configuration
      };
      Object.assign(project, input, { updatedAt: new Date().toISOString() });

      const changed: string[] = [];
      if (previous.maintenanceVersion !== input.maintenanceVersion) changed.push('维护版本');
      if (previous.softwareVersion !== input.softwareVersion) changed.push('软件版本');
      if (previous.configuration !== input.configuration) changed.push('配置范围');

      const baselineChanged = previous.softwareVersion !== input.softwareVersion;

      if (changed.length) {
        const version: ProjectVersion = {
          id: makeId('VER'),
          label: `${input.maintenanceVersion} / ${input.softwareVersion}`,
          author: project.applicant,
          createdAt: new Date().toISOString(),
          summary: `更新${changed.join('、')}：${reason}`,
          changes: changed,
          impactedConfigurations: [input.configuration]
        };
        project.versions.unshift(version);
        project.audit.unshift(
          audit(project.applicant, '更新项目版本', `${changed.join('、')}；影响配置：${input.configuration}`)
        );
      } else {
        project.audit.unshift(audit(project.applicant, '更新项目资料', reason));
      }

    // 软件基线一变，旧基线上的已接受结论立即失效，转入“待重新确认”
    if (baselineChanged) {
      const invalidated = this.invalidateReviewsForBaseline(project, previous.softwareVersion, input.softwareVersion, project.applicant);
      if (invalidated) {
        project.audit.unshift(
          audit(
            project.applicant,
            '审阅结论失效',
            `软件基线 ${previous.softwareVersion} → ${input.softwareVersion}，${invalidated} 项既有审阅结论失效，须按新基线重新确认后方可计入覆盖。`
          )
        );
      }
    }

      recomputeProjectCoverage(project);
      this.persist();
      return true;
    },

    // 将旧基线时期形成的已接受结论全部标记为重新确认：
    // 软件基线一旦变化，无论证据是否已预填新版本号，审阅结论都不能自动沿用
    invalidateReviewsForBaseline(
      project: ApprovalProject,
      fromBaseline: string,
      toBaseline: string,
      _actor: string
    ): number {
      let count = 0;
      project.evidence.forEach((item) => {
        if (item.status !== 'accepted') return;
        const reviewed = item.reviewedSoftwareVersion ?? item.softwareVersion;
        if (reviewed !== fromBaseline) return;
        item.status = 'reconfirm';
        item.note = `软件基线升级为 ${toBaseline}，原基于 ${fromBaseline} 的接受结论失效，需重新确认。${item.note}`;
        item.updatedAt = new Date().toISOString();
        // 保留原结论基线以便追溯；证据内容本身标注的软件版本不动，由重认时核对
        item.reviewedSoftwareVersion = fromBaseline;
        count += 1;
      });
      return count;
    },

    transition(id: string, status: ProjectStatus, actor: string, reason: string) {
      const project = this.projects.find((item) => item.id === id);
      if (!project) return false;
      if (!this.assertNotTampered(project)) return false;

      // 已批准且持有活动冻结快照时，只允许“重新打开审阅”，其他流转一律拒绝
      if (project.frozenSnapshot && status !== 'under_review') {
        project.audit.unshift(audit(actor, '拒绝状态流转', '项目已批准冻结，该流转不允许；冻结快照保持不变。'));
        this.persist();
        return false;
      }

      // 重新打开审阅：活动冻结快照归档为不可改写的历史，当前周期可继续写入新版本
      if (project.frozenSnapshot && status === 'under_review') {
        project.frozenHistory = [...(project.frozenHistory ?? []), project.frozenSnapshot];
        project.frozenSnapshot = undefined;
        project.audit.unshift(
          audit(
            actor,
            '重新打开审阅',
            `批准快照已归档保留（基线 SW ${project.frozenHistory.at(-1)?.softwareVersion}），新一轮审阅可继续补件，但归档快照不可改写。理由：${reason}`
          )
        );
      }

      project.status = status;
      if (status === 'submitted') project.submittedAt = new Date().toISOString().slice(0, 10);
      if (status === 'approved') {
        project.progress = 100;
        // 批准时写入不可改写的冻结快照
        project.frozenSnapshot = {
          projectId: project.id,
          status: 'approved',
          maintenanceVersion: project.maintenanceVersion,
          softwareVersion: project.softwareVersion,
          frozenAt: new Date().toISOString(),
          frozenBy: actor,
          evidenceCount: project.evidence.length,
          checksum: checksum(frozenSnapshotPayload(project))
        };
      }
      if (status === 'supplement_required') project.progress = Math.min(project.progress, 82);
      project.updatedAt = new Date().toISOString();
      project.audit.unshift(audit(actor, '审批状态流转', `${status}；${reason}`));
      this.persist();
      return true;
    },

    updateEvidence(projectId: string, evidenceId: string, status: EvidenceItem['status'], note: string) {
      const project = this.projects.find((item) => item.id === projectId);
      const evidence = project?.evidence.find((item) => item.id === evidenceId);
      if (!project || !evidence) return false;
      if (project.frozenSnapshot) {
        project.audit.unshift(audit(project.reviewer, '拒绝证据改写', `《${evidence.name}》属于已批准冻结快照，不可改写。`));
        this.persist();
        return false;
      }
      evidence.status = status;
      evidence.note = note || evidence.note;
      evidence.updatedAt = new Date().toISOString();
      // 记录本次结论所依据的软件基线；基线再变时据此判定失效
      if (['accepted', 'rejected'].includes(status)) {
        evidence.reviewedSoftwareVersion = project.softwareVersion;
      }
      project.updatedAt = evidence.updatedAt;
      project.audit.unshift(audit(project.reviewer, '更新证据状态', `${evidence.name}：${status}（基线 SW ${project.softwareVersion}）`));
      recomputeProjectCoverage(project);
      this.persist();
      return true;
    },

    bulkSupplement(projectId: string, evidenceIds: string[], note: string) {
      const project = this.projects.find((item) => item.id === projectId);
      if (!project) return 0;
      if (project.frozenSnapshot) return 0;
      let count = 0;
      project.evidence.forEach((evidence) => {
        if (!evidenceIds.includes(evidence.id)) return;
        evidence.status = 'submitted';
        evidence.softwareVersion = project.softwareVersion;
        evidence.note = note;
        evidence.updatedAt = new Date().toISOString();
        count += 1;
      });
      if (count) {
        project.progress = Math.min(95, project.progress + count * 4);
        project.updatedAt = new Date().toISOString();
        project.audit.unshift(audit(project.applicant, '批量补件', `${count} 项证据更新至 ${project.softwareVersion}。${note}`));
        recomputeProjectCoverage(project);
        this.persist();
      }
      return count;
    },

    // 对账确认：一次事务性写入全部变化（证据、覆盖、版本、审计）。
    // 幂等：同一 packageId 已存在“离线补件合并确认”审计时不再产生第二套。
    commitReconciliation(session: ReconcileSession, actor: string): ReconcileCommitResult {
      const project = this.projects.find((item) => item.id === session.projectId);
      if (!project) {
        return { ok: false, error: '对账项目不存在', applied: 0, reconfirm: 0, skipped: 0, unresolved: 0, auditCreated: false };
      }
      if (project.frozenSnapshot) {
        return {
          ok: false,
          error: '项目已批准并冻结，不能写入补件；冻结快照保持不变',
          applied: 0,
          reconfirm: 0,
          skipped: 0,
          unresolved: 0,
          auditCreated: false
        };
      }
      if (!this.assertNotTampered(project)) {
        return { ok: false, error: '冻结快照校验失败，写入被拒绝', applied: 0, reconfirm: 0, skipped: 0, unresolved: 0, auditCreated: false };
      }

      // 提交前再次确认基线是否在确认期间又漂移
      if (project.softwareVersion !== session.currentBaselineAtImport) {
        return {
          ok: false,
          error: `确认期间软件基线又由 ${session.currentBaselineAtImport} 变为 ${project.softwareVersion}，请重新对账后再确认`,
          applied: 0,
          reconfirm: 0,
          skipped: 0,
          unresolved: 0,
          auditCreated: false
        };
      }

      // 必须为每条可处理项给出决议；baseline_conflict / unknown_regulation 只能 reconfirm 或 skip
      const actionable = session.items.filter(
        (item) => !['frozen'].includes(item.disposition)
      );
      const unresolved = actionable.filter((item) => !item.resolution).length;
      if (unresolved) {
        return { ok: false, error: `还有 ${unresolved} 条补件未给出处置决议`, applied: 0, reconfirm: 0, skipped: 0, unresolved, auditCreated: false };
      }

      // 幂等：同一补件包只允许一套确认审计与版本
      const alreadyCommitted = project.audit.some(
        (entry) => entry.packageId === session.packageId && entry.action === '离线补件合并确认'
      );
      if (alreadyCommitted) {
        const result: ReconcileCommitResult = { ok: true, applied: 0, reconfirm: 0, skipped: actionable.length, unresolved: 0, auditCreated: false };
        return result;
      }

      // 在工作副本上一次性应用全部变化，任何一步抛错都不会落盘。
      // 不能使用 structuredClone：Pinia 状态是响应式 Proxy，会抛 DataCloneError。
      const working: ApprovalProject = JSON.parse(JSON.stringify(project)) as ApprovalProject;
      let applied = 0;
      let reconfirm = 0;
      let skipped = 0;

      for (const item of session.items) {
        const { entry, resolution } = item;
        if (resolution === 'skip' || item.disposition === 'frozen') {
          skipped += 1;
          continue;
        }

        if (resolution === 'reconfirm') {
          // 基线漂移：离线结论失效，证据落为“待重新确认”，不采纳离线决定
          const existing = working.evidence.find((evidence) => evidence.id === entry.evidenceId);
          if (existing) {
            existing.status = 'reconfirm';
            existing.softwareVersion = project.softwareVersion;
            existing.reviewedSoftwareVersion = session.offlineBaseline;
            existing.note = `离线补件基于 ${session.offlineBaseline} 的结论已失效，等待按当前基线 ${project.softwareVersion} 重新确认。${entry.note}`;
            existing.updatedAt = new Date().toISOString();
            existing.sourcePackageId = session.packageId;
          } else {
            working.evidence.push({
              id: entry.evidenceId,
              projectId: working.id,
              regulationId: entry.regulationId,
              name: entry.name,
              type: entry.type,
              version: entry.fileVersion,
              softwareVersion: project.softwareVersion,
              configurations: [...entry.configurations],
              status: 'reconfirm',
              note: `离线补件基于 ${session.offlineBaseline} 的结论已失效，等待按当前基线 ${project.softwareVersion} 重新确认。${entry.note}`,
              updatedAt: new Date().toISOString(),
              reviewedSoftwareVersion: session.offlineBaseline,
              sourcePackageId: session.packageId,
              expiryDate: entry.expiryDate
            });
          }
          reconfirm += 1;
          continue;
        }

        // resolution === 'apply'
        const existing = working.evidence.find((evidence) => evidence.id === entry.evidenceId);
        const payload: EvidenceItem = {
          id: entry.evidenceId,
          projectId: working.id,
          regulationId: entry.regulationId,
          name: entry.name,
          type: entry.type,
          version: entry.fileVersion,
          softwareVersion: project.softwareVersion,
          configurations: [...entry.configurations],
          status: entry.decision,
          note: entry.note,
          updatedAt: new Date().toISOString(),
          reviewedSoftwareVersion: project.softwareVersion,
          sourcePackageId: session.packageId,
          expiryDate: entry.expiryDate
        };
        if (existing) Object.assign(existing, payload);
        else working.evidence.push(payload);
        applied += 1;
      }

      // 统一重算全部法规覆盖：apply 的证据计入覆盖，reconfirm 使对应法规转为冲突
      recomputeProjectCoverage(working);

      working.versions.unshift({
        id: makeId('VER'),
        label: `${working.maintenanceVersion} / ${working.softwareVersion}`,
        author: actor,
        createdAt: new Date().toISOString(),
        summary: `离线补件包 ${session.packageId} 回网合并确认`,
        changes: [
          `采纳 ${applied} 项补件更新/新增`,
          `${reconfirm} 项因软件基线 ${session.offlineBaseline}→${project.softwareVersion} 失效待重新确认`,
          `跳过 ${skipped} 项（当前审阅优先/重复/冻结）`
        ],
        impactedConfigurations: Array.from(
          new Set(session.items.flatMap((item) => item.entry.configurations))
        ),
        sourcePackageId: session.packageId
      });

      working.audit.unshift(
        audit(
          actor,
          '离线补件合并确认',
          `补件包 ${session.packageId}（离网基线 SW ${session.offlineBaseline}，确认基线 SW ${project.softwareVersion}）：采纳 ${applied} 项，${reconfirm} 项失效待重新确认，跳过 ${skipped} 项。一次写入全部变化。`,
          session.packageId
        )
      );
      working.updatedAt = new Date().toISOString();

      // 全部成功后才整体替换并落盘（原子提交）
      const index = this.projects.findIndex((candidate) => candidate.id === project.id);
      this.projects[index] = working;
      this.persist();

      return { ok: true, applied, reconfirm, skipped, unresolved: 0, auditCreated: true };
    },

    reset() {
      this.projects = migrate(cloneSeed());
      this.persist();
    }
  }
});
