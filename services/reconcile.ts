import type {
  ApprovalProject,
  EvidenceItem,
  ProjectConflict,
  RegulationItem,
  ReconcileLine,
  SupplementPackage,
  SupplementPackageEvidence
} from '~/types/certification';

/** 基线标签：证据失效时记录其被审阅时所依据的基线 */
export function baselineLabel(maintenanceVersion: string, softwareVersion: string) {
  return `${maintenanceVersion} / SW ${softwareVersion}`;
}

function compareFileVersion(a: string, b: string) {
  // 文件版本形如 R3 / S2 / D1：前缀字母 + 序号；退化时按字符串比较
  const pa = a.match(/^([A-Za-z]*)(\d+)$/);
  const pb = b.match(/^([A-Za-z]*)(\d+)$/);
  if (pa && pb && pa[1] === pb[1]) return Number(pa[2]) - Number(pb[2]);
  return a.localeCompare(b, undefined, { numeric: true });
}

function sameConfigurations(a: string[], b: string[]) {
  return a.length === b.length && a.every((value) => b.includes(value));
}

function lineKey(pkgItem: SupplementPackageEvidence) {
  return pkgItem.evidenceId ?? `${pkgItem.regulationId}:${pkgItem.name}`;
}

/**
 * 按证据版本逐项比较离线补件包与当前项目。
 * 比较规则：
 * - 当前基线与补件包导出基线不一致（软件基线被另一位审阅人改动）：
 *   包内任何离线审阅结论都不能直接生效，逐项进入 reconfirm；
 * - 同基线下包文件版本更新：safe_update，可安全合并并更新对应覆盖；
 * - 同版本但结论分歧：review_conflict，默认保留当前审阅；
 * - 包版本更旧：keep_current；完全一致：unchanged；项目无对应证据：add_evidence。
 */
export function reconcilePackage(project: ApprovalProject, pkg: SupplementPackage): ReconcileLine[] {
  const baselineChanged =
    project.softwareVersion !== pkg.baseline.softwareVersion ||
    project.maintenanceVersion !== pkg.baseline.maintenanceVersion;

  return pkg.items.map((pkgItem) => {
    const key = lineKey(pkgItem);
    const current = pkgItem.evidenceId
      ? project.evidence.find((item) => item.id === pkgItem.evidenceId)
      : undefined;

    const base = {
      key,
      regulationId: pkgItem.regulationId,
      name: pkgItem.name,
      type: pkgItem.type,
      note: pkgItem.note,
      configurations: pkgItem.configurations,
      matchedEvidenceId: current?.id,
      packageVersion: pkgItem.version,
      packageSoftwareVersion: pkgItem.softwareVersion,
      packageDecision: pkgItem.status,
      packageUpdatedAt: pkgItem.updatedAt,
      currentVersion: current?.version,
      currentSoftwareVersion: current?.softwareVersion,
      currentDecision: current?.status
    };

    if (!current) {
      return {
        ...base,
        outcome: baselineChanged ? 'reconfirm' : 'add_evidence',
        reason: baselineChanged
          ? `当前基线 ${baselineLabel(project.maintenanceVersion, project.softwareVersion)} 与补件包导出基线 ${baselineLabel(pkg.baseline.maintenanceVersion, pkg.baseline.softwareVersion)} 不一致，新增证据须在当前基线下重新确认`
          : '当前项目尚无该证据，可随补件包新增',
        defaultDecision: baselineChanged ? 'reconfirm_review' : 'apply_package'
      };
    }

    if (baselineChanged) {
      return {
        ...base,
        outcome: 'reconfirm',
        reason: `软件基线已由 ${pkg.baseline.softwareVersion} 变更为 ${project.softwareVersion}，离线审阅结论失效，须按当前基线重新确认`,
        defaultDecision: 'reconfirm_review'
      };
    }

    const versionDiff = compareFileVersion(pkgItem.version, current.version);
    const sameContent =
      versionDiff === 0 &&
      pkgItem.softwareVersion === current.softwareVersion &&
      sameConfigurations(pkgItem.configurations, current.configurations);

    if (versionDiff > 0) {
      return {
        ...base,
        outcome: 'safe_update',
        reason: `同基线下文件版本由 ${current.version} 更新至 ${pkgItem.version}，可安全合并`,
        defaultDecision: 'apply_package'
      };
    }

    if (versionDiff < 0) {
      return {
        ...base,
        outcome: 'keep_current',
        reason: `补件包文件版本 ${pkgItem.version} 早于当前 ${current.version}，保留当前结果，后到结果不得覆盖`,
        defaultDecision: 'keep_current'
      };
    }

    // 文件版本相同
    if (sameContent && pkgItem.status === current.status) {
      return {
        ...base,
        outcome: 'unchanged',
        reason: '文件版本、软件版本、配置覆盖与审阅结论均无变化',
        defaultDecision: 'keep_current'
      };
    }

    return {
      ...base,
      outcome: 'review_conflict',
      reason: `文件版本相同但审阅结论分歧：当前为 ${current.status}，补件包为 ${pkgItem.status}，保留当前审阅`,
      defaultDecision: 'keep_current'
    };
  });
}

/** 软件基线变更后，已有审阅结论一律失效，等待按新基线重新确认 */
export function invalidateReviewForBaselineChange(
  evidence: EvidenceItem[],
  previousBaseline: string,
  nextSoftwareVersion: string,
  at: string
): EvidenceItem[] {
  return evidence.map((item) => {
    if (item.status === 'accepted' || item.status === 'rejected') {
      return {
        ...item,
        status: 'stale',
        reviewDecision: item.status,
        reviewedBaseline: item.reviewedBaseline ?? previousBaseline,
        invalidatedAt: at
      };
    }
    if (item.status === 'stale') {
      // 已失效未重认、基线再次变动：保留原结论与原始审阅基线，只刷新失效时间
      return { ...item, invalidatedAt: at };
    }
    // submitted / resubmit / missing：软件版本对齐到新基线后再审阅
    return item.softwareVersion === nextSoftwareVersion ? item : { ...item };
  });
}

/* ---------- 法规覆盖重算 ---------- */

/**
 * 依据当前证据重新计算各法规项覆盖：
 * - accepted 且软件版本与项目基线一致的证据计入覆盖；
 * - stale（基线变更后失效）导致覆盖下降并给出明确 issue；
 * - 软件版本错配记为 conflict；
 * - 无有效证据记为 missing。
 */
export function recomputeRegulations(
  regulations: RegulationItem[],
  evidence: EvidenceItem[],
  projectSoftwareVersion: string
): RegulationItem[] {
  return regulations.map((regulation) => {
    const linked = evidence.filter((item) => item.regulationId === regulation.id);
    const accepted = linked.filter((item) => item.status === 'accepted');
    const onBaselineAccepted = accepted.filter((item) => item.softwareVersion === projectSoftwareVersion);
    const stale = linked.filter((item) => item.status === 'stale');
    const mismatched = linked.filter(
      (item) => ['accepted', 'submitted', 'resubmit'].includes(item.status) && item.softwareVersion !== projectSoftwareVersion
    );

    const issues: string[] = [];
    let status: RegulationItem['status'] = 'missing';
    let coverage = 0;

    if (!linked.length) {
      issues.push('尚未关联测试报告');
    } else {
      if (stale.length) issues.push(`${stale.length} 项证据因软件基线变更失效，覆盖结论待重新确认`);
      if (mismatched.length) issues.push(`${mismatched.length} 项证据软件版本 ${mismatched[0].softwareVersion} 与基线 ${projectSoftwareVersion} 不一致`);

      if (onBaselineAccepted.length) {
        // 以有效证据覆盖的配置数粗略估算覆盖率
        const configs = new Set(onBaselineAccepted.flatMap((item) => item.configurations));
        coverage = Math.min(100, Math.round((configs.size / Math.max(1, configs.size + (stale.length ? 1 : 0))) * 100));
      }
      if (stale.length || mismatched.length) {
        status = 'conflict';
        coverage = Math.max(coverage, stale.length ? 50 : 60);
      } else if (accepted.length === linked.length && onBaselineAccepted.length === accepted.length) {
        status = 'complete';
        coverage = 100;
      } else if (accepted.length) {
        status = 'conflict';
      } else {
        status = 'missing';
        issues.push('证据尚未审阅通过');
      }
    }

    return { ...regulation, status, coverage, issues };
  });
}

/* ---------- 提交包导出 ---------- */

export interface ExportedSubmissionPackage {
  packageKind: 'submission_export';
  generatedAt: string;
  project: {
    id: string;
    name: string;
    status: ApprovalProject['status'];
  };
  adoptedBaseline: {
    maintenanceVersion: string;
    softwareVersion: string;
    frozen: boolean;
  };
  frozenSnapshot?: ApprovalProject['frozenSnapshot'];
  unresolvedConflicts: ProjectConflict[];
  staleEvidence: EvidenceItem[];
  regulations: RegulationItem[];
  evidence: EvidenceItem[];
  audit: ApprovalProject['audit'];
}

/** 导出提交包：标明采用基线、冻结快照与未处理冲突，导出口径与当前对账状态一致 */
export function buildSubmissionExport(project: ApprovalProject): ExportedSubmissionPackage {
  const unresolvedConflicts = project.conflicts.filter((conflict) => !conflict.resolved);
  const staleEvidence = project.evidence.filter((item) => item.status === 'stale');
  return {
    packageKind: 'submission_export',
    generatedAt: new Date().toISOString(),
    project: { id: project.id, name: project.name, status: project.status },
    adoptedBaseline: {
      maintenanceVersion: project.maintenanceVersion,
      softwareVersion: project.softwareVersion,
      frozen: Boolean(project.frozenSnapshot)
    },
    frozenSnapshot: project.frozenSnapshot,
    unresolvedConflicts,
    staleEvidence,
    regulations: project.regulations,
    evidence: project.evidence,
    audit: project.audit
  };
}
