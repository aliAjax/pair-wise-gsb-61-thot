import type {
  ApprovalProject,
  EvidenceItem,
  OfflineEvidenceEntry,
  OfflineSupplementPackage,
  ReconcileDisposition,
  ReconcileItem,
  RegulationItem
} from '~/types/certification';

/* --------------------------- 文件版本比较 --------------------------- */

// 从 "R3"、"R10"、"S2"、"V1.2" 等版本号中取出末尾的数字序列做数值比较，
// 避免 R10 被字符串比较判定为小于 R2。
function versionTrail(version: string): number[] {
  const matches = version.match(/\d+/g);
  return matches ? matches.map((value) => Number(value)) : [];
}

export function compareFileVersion(a: string, b: string): number {
  const trailA = versionTrail(a);
  const trailB = versionTrail(b);
  if (trailA.length && trailB.length) {
    const length = Math.max(trailA.length, trailB.length);
    for (let index = 0; index < length; index += 1) {
      const partA = trailA[index] ?? 0;
      const partB = trailB[index] ?? 0;
      if (partA !== partB) return partA > partB ? 1 : -1;
    }
    return 0;
  }
  return a.localeCompare(b, undefined, { numeric: true });
}

/* --------------------------- 冻结快照校验值 --------------------------- */

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value as Record<string, unknown>)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

// 32 位 FNV-1a，本地无后端场景下足以发现快照被改写
export function checksum(value: unknown): string {
  const text = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

// 已批准项目的冻结内容：证据、版本与基线共同构成不可改写快照
export function frozenSnapshotPayload(project: ApprovalProject) {
  return {
    id: project.id,
    status: project.status,
    maintenanceVersion: project.maintenanceVersion,
    softwareVersion: project.softwareVersion,
    evidence: project.evidence.map((item) => ({
      id: item.id,
      regulationId: item.regulationId,
      version: item.version,
      softwareVersion: item.softwareVersion,
      status: item.status,
      configurations: [...item.configurations]
    })),
    versions: project.versions.map((item) => item.id)
  };
}

export function isFrozenSnapshotIntact(project: ApprovalProject): boolean {
  const snapshot = project.frozenSnapshot;
  if (!snapshot) return false;
  return snapshot.checksum === checksum(frozenSnapshotPayload(project));
}

/* --------------------------- 证据 / 法规覆盖重算 --------------------------- */

// 证据是否在当前软件基线上仍然有效
export function evidenceOnCurrentBaseline(item: EvidenceItem, project: ApprovalProject): boolean {
  const reviewed = item.reviewedSoftwareVersion ?? item.softwareVersion;
  return reviewed === project.softwareVersion && item.softwareVersion === project.softwareVersion;
}

// 证据是否处于“已通过、可计入覆盖”的状态
function evidenceCountsAsCovered(item: EvidenceItem): boolean {
  return item.status === 'accepted' || item.status === 'submitted';
}

export function recomputeRegulation(regulation: RegulationItem, linked: EvidenceItem[], project: ApprovalProject): void {
  const onBaseline = linked.filter((item) => evidenceOnCurrentBaseline(item, project));
  const valid = onBaseline.filter((item) => evidenceCountsAsCovered(item));
  const stale = linked.filter(
    (item) => item.status === 'reconfirm' || (item.status === 'accepted' && !evidenceOnCurrentBaseline(item, project))
  );
  const unresolved = linked.filter((item) => item.status === 'rejected' || item.status === 'resubmit');

  const issues: string[] = [];
  if (!linked.length) {
    regulation.status = 'missing';
    regulation.coverage = 0;
    issues.push('尚未关联测试报告');
  } else if (stale.length) {
    regulation.status = 'conflict';
    stale.forEach((item) => {
      issues.push(`《${item.name}》的审阅结论基于软件 ${item.reviewedSoftwareVersion ?? item.softwareVersion}，当前基线 ${project.softwareVersion}，需重新确认`);
    });
  } else if (unresolved.length || !valid.length) {
    regulation.status = 'missing';
    unresolved.forEach((item) => issues.push(`《${item.name}》${item.status === 'resubmit' ? '需重新抽样' : '审阅未通过'}`));
    if (!unresolved.length && !valid.length) issues.push('证据尚未完成审阅');
  } else {
    regulation.status = 'complete';
  }

  regulation.coverage = linked.length ? Math.round((valid.length / linked.length) * 100) : 0;
  regulation.issues = issues;
}

export function recomputeProjectCoverage(project: ApprovalProject): void {
  project.regulations.forEach((regulation) => {
    recomputeRegulation(
      regulation,
      project.evidence.filter((item) => item.regulationId === regulation.id),
      project
    );
  });
  const required = project.regulations.filter((item) => item.required);
  if (required.length) {
    const complete = required.filter((item) => item.status === 'complete').length;
    const score = Math.round((complete / required.length) * 100);
    project.progress = project.status === 'approved' ? 100 : Math.max(project.progress, score);
  }
}

/* --------------------------- 逐项比对（对账核心） --------------------------- */

// 导入先按证据版本逐项比较，得出每条补件的处置分类与原因。
// 关键规则：
//  - 项目已批准冻结：frozen，任何补件不得写入
//  - 引用法规不存在：unknown_regulation，挂起人工处理
//  - 补件依据的软件基线与网内当前基线不一致：baseline_conflict，
//    离线结论失效，必须由当前审阅人按新基线重新确认，不能直接盖掉当前审阅
//  - 网内无该证据：safe_new
//  - 文件版本相同且状态一致：duplicate（重复提交不产生第二套动作）
//  - 网内审阅时间更新：current_newer（后到结果不能盖掉当前审阅）
//  - 补件文件版本更新且基线一致：safe_update
export function classifyEntry(
  entry: OfflineEvidenceEntry,
  project: ApprovalProject
): { disposition: ReconcileDisposition; reason: string; online?: EvidenceItem } {
  if (project.frozenSnapshot) {
    return {
      disposition: 'frozen',
      reason: `项目已于冻结基线 ${project.frozenSnapshot.softwareVersion} 批准，补件不得改写冻结快照；如需处理请先重新打开审阅`
    };
  }

  const regulation = project.regulations.find((item) => item.id === entry.regulationId);
  if (!regulation) {
    return {
      disposition: 'unknown_regulation',
      reason: `补件引用的法规项 ${entry.regulationId} 在当前项目中不存在，需人工核对法规适用性`
    };
  }

  const online = project.evidence.find((item) => item.id === entry.evidenceId);

  // 软件基线漂移：无论网内有无该证据，离线审阅结论都不能直接生效
  if (entry.softwareVersion !== project.softwareVersion) {
    return online
      ? {
          disposition: 'baseline_conflict',
          reason: `补件基于软件 ${entry.softwareVersion}，当前基线已变为 ${project.softwareVersion}；网内《${online.name}》的既有结论需按新基线重新确认，离线结论不得覆盖`,
          online
        }
      : {
          disposition: 'baseline_conflict',
          reason: `补件基于软件 ${entry.softwareVersion}，当前基线已变为 ${project.softwareVersion}，证据需在新基线上重新确认`,
          online
        };
  }

  if (!online) {
    return {
      disposition: 'safe_new',
      reason: `网内尚无该证据，补件文件版本 ${entry.fileVersion} 与当前基线 ${project.softwareVersion} 一致，可安全新增`,
      online
    };
  }

  const fileCompare = compareFileVersion(entry.fileVersion, online.version);
  const onlineTime = online.updatedAt ? Date.parse(online.updatedAt) : 0;
  const offlineTime = Date.parse(entry.reviewedAt);

  if (fileCompare === 0 && online.status === entry.decision) {
    return {
      disposition: 'duplicate',
      reason: `文件版本同为 ${entry.fileVersion} 且审阅结论一致（${entry.decision}），属于重复提交`,
      online
    };
  }

  // 网内审阅比离线结论更新：当前审阅优先
  if (onlineTime > offlineTime) {
    return {
      disposition: 'current_newer',
      reason: `网内审阅时间（${online.updatedAt.slice(0, 10)}）晚于离线补件（${entry.reviewedAt.slice(0, 10)}），保留当前审阅结果，后到补件不覆盖`,
      online
    };
  }

  if (fileCompare > 0) {
    return {
      disposition: 'safe_update',
      reason: `补件文件版本 ${entry.fileVersion} 新于网内 ${online.version}，软件基线一致（${project.softwareVersion}），可安全更新覆盖`,
      online
    };
  }

  // 补件不比网内新，或网内已有更新结论：当前审阅优先
  return {
    disposition: 'current_newer',
    reason: `网内文件版本 ${online.version} 不旧于补件 ${entry.fileVersion}，保留当前审阅结果`,
    online
  };
}

export function buildReconcileItems(pkg: OfflineSupplementPackage, project: ApprovalProject): ReconcileItem[] {
  return pkg.evidenceEntries.map((entry) => {
    const { disposition, reason, online } = classifyEntry(entry, project);
    return {
      entry,
      disposition,
      resolution: null,
      processed: false,
      reason,
      onlineVersion: online?.version,
      onlineSoftwareVersion: online?.softwareVersion,
      onlineStatus: online?.status,
      onlineReviewedAt: online?.updatedAt
    };
  });
}

// 校验补件包结构，导入失败时给出明确原因
export function validatePackage(raw: string): { ok: true; value: OfflineSupplementPackage } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: '补件包不是合法的 JSON 文件' };
  }
  const pkg = parsed as Partial<OfflineSupplementPackage>;
  if (!pkg || typeof pkg !== 'object') return { ok: false, error: '补件包内容为空' };
  if (!pkg.packageId) return { ok: false, error: '补件包缺少 packageId' };
  if (!pkg.projectId) return { ok: false, error: '补件包缺少项目编号 projectId' };
  if (!pkg.baselineSoftwareVersion) return { ok: false, error: '补件包缺少离网软件基线' };
  if (!Array.isArray(pkg.evidenceEntries)) return { ok: false, error: '补件包缺少证据条目列表' };
  for (const entry of pkg.evidenceEntries as Partial<OfflineEvidenceEntry>[]) {
    if (!entry.evidenceId || !entry.regulationId || !entry.fileVersion || !entry.softwareVersion || !entry.decision || !entry.reviewedAt) {
      return { ok: false, error: `补件条目 ${entry.evidenceId ?? '(无编号)'} 字段不完整` };
    }
  }
  return { ok: true, value: parsed as OfflineSupplementPackage };
}
