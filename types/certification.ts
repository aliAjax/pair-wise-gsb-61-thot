export const projectStatuses = [
  'draft',
  'submitted',
  'under_review',
  'supplement_required',
  'approved',
  'rejected'
] as const;

// stale：软件基线变更后，原审阅结论失效，等待重新确认
export const evidenceStatuses = ['missing', 'submitted', 'accepted', 'rejected', 'resubmit', 'stale'] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type EvidenceStatus = (typeof evidenceStatuses)[number];
export type ReviewDecision = Extract<EvidenceStatus, 'accepted' | 'rejected' | 'resubmit'>;

export interface RegulationItem {
  id: string;
  code: string;
  title: string;
  category: '安全' | '环保' | '能耗' | '软件' | '部件';
  required: boolean;
  status: 'complete' | 'missing' | 'conflict';
  coverage: number;
  issues: string[];
}

export interface EvidenceItem {
  id: string;
  projectId: string;
  regulationId: string;
  name: string;
  type: 'test_report' | 'part_list' | 'software_report' | 'exemption' | 'certificate';
  version: string;
  softwareVersion: string;
  configurations: string[];
  status: EvidenceStatus;
  expiryDate?: string;
  note: string;
  updatedAt: string;
  /** 被基线变更失效前的审阅结论 */
  reviewDecision?: ReviewDecision;
  /** 上次审阅所依据的基线标签，如 MY27.1 / SW 8.4.1 */
  reviewedBaseline?: string;
  reviewedAt?: string;
  /** 结论失效时间，存在且状态为 stale 时表示等待重新确认 */
  invalidatedAt?: string;
}

export interface ProjectVersion {
  id: string;
  label: string;
  author: string;
  createdAt: string;
  summary: string;
  changes: string[];
  impactedConfigurations: string[];
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
  /** 幂等键：同一业务事件（如一次对账确认）重复提交不产生第二条审计 */
  dedupKey?: string;
}

/** 已批准项目的冻结快照，批准后不可改写 */
export interface FrozenSnapshot {
  frozenAt: string;
  maintenanceVersion: string;
  softwareVersion: string;
  configuration: string;
  regulations: RegulationItem[];
  evidence: EvidenceItem[];
}

export type ProjectConflictKind = 'review_divergence' | 'baseline_drift';

export interface ProjectConflict {
  id: string;
  kind: ProjectConflictKind;
  evidenceId?: string;
  evidenceName: string;
  description: string;
  packageId?: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface ApprovalProject {
  id: string;
  name: string;
  modelCode: string;
  vehicleType: string;
  configuration: string;
  maintenanceVersion: string;
  softwareVersion: string;
  status: ProjectStatus;
  progress: number;
  applicant: string;
  reviewer: string;
  agency: string;
  submittedAt?: string;
  updatedAt: string;
  certificateExpiry: string;
  regulations: RegulationItem[];
  evidence: EvidenceItem[];
  versions: ProjectVersion[];
  audit: AuditEntry[];
  conflicts: ProjectConflict[];
  frozenSnapshot?: FrozenSnapshot;
}

export interface ProjectInput {
  name: string;
  modelCode: string;
  vehicleType: string;
  configuration: string;
  maintenanceVersion: string;
  softwareVersion: string;
  applicant: string;
  agency: string;
  certificateExpiry: string;
}

export interface ProjectFilters {
  query: string;
  status: ProjectStatus | 'all';
  agency: string | 'all';
  risk: 'all' | 'expiring' | 'missing' | 'version_conflict';
}

/* ---------- 离线补件包 ---------- */

export interface SupplementPackageEvidence {
  evidenceId?: string;
  regulationId: string;
  name: string;
  type: EvidenceItem['type'];
  version: string;
  softwareVersion: string;
  configurations: string[];
  status: Extract<EvidenceStatus, 'submitted' | 'accepted' | 'rejected' | 'resubmit'>;
  note: string;
  updatedAt: string;
}

export interface SupplementPackage {
  packageId: string;
  projectId: string;
  reviewer: string;
  exportedAt: string;
  note?: string;
  baseline: {
    maintenanceVersion: string;
    softwareVersion: string;
  };
  items: SupplementPackageEvidence[];
  /** 回网上传时前 N 次传输失败，随后立即重试放行（模拟离线回网链路抖动） */
  failFirstAttempts?: number;
  /** 确认写入时剩余的中途断连次数（模拟部分确认后断连，重试不重做已确认行） */
  failConfirmOnce?: boolean;
}

/* ---------- 逐项对账 ---------- */

/**
 * safe_update：同基线下补件包文件版本更新，可安全合并
 * add_evidence：当前项目没有对应证据，随包新增
 * reconfirm：补件包导出基线与当前基线不一致，离线审阅结论一律失效重认
 * review_conflict：同版本但审阅结论分歧，默认保留当前审阅，不得被后到结果覆盖
 * keep_current：补件包内容比当前更旧，保留当前
 * unchanged：内容与结论均无变化
 */
export type ReconcileOutcome =
  | 'safe_update'
  | 'add_evidence'
  | 'reconfirm'
  | 'review_conflict'
  | 'keep_current'
  | 'unchanged';

export type ReconcileDecision = 'apply_package' | 'keep_current' | 'reconfirm_review';

export interface ReconcileLine {
  key: string;
  outcome: ReconcileOutcome;
  reason: string;
  /** 对账计算出的默认处理方式 */
  defaultDecision: ReconcileDecision;
  regulationId: string;
  name: string;
  type: EvidenceItem['type'];
  note: string;
  configurations: string[];
  matchedEvidenceId?: string;
  packageVersion?: string;
  packageSoftwareVersion?: string;
  packageDecision?: SupplementPackageEvidence['status'];
  packageUpdatedAt?: string;
  currentVersion?: string;
  currentSoftwareVersion?: string;
  currentDecision?: EvidenceStatus;
  /** 确认时是否已实际落库 */
  applied?: boolean;
}

export type ImportSessionStatus = 'comparing' | 'awaiting_confirmation' | 'failed' | 'confirmed' | 'abandoned';

export interface ImportSession {
  id: string;
  packageId: string;
  projectId: string;
  reviewer: string;
  exportedAt: string;
  baselineAtExport: SupplementPackage['baseline'];
  status: ImportSessionStatus;
  lines: ReconcileLine[];
  /** 原始补件包，失败后用同一补件包重试 */
  packageSnapshot: SupplementPackage;
  /** 审阅人在页面上暂存但尚未确认的逐项选择（安全点） */
  draftDecisions: Record<string, ReconcileDecision>;
  transportAttempts: number;
  lastError?: string;
  /** 注入式"部分确认后断连"是否已经发生过一次 */
  partialFailureConsumed?: boolean;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  auditEntryId?: string;
  /** 同一补件包重复导入时复用既有会话 */
  duplicated?: boolean;
}
