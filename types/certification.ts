export const projectStatuses = [
  'draft',
  'submitted',
  'under_review',
  'supplement_required',
  'approved',
  'rejected'
] as const;

// reconfirm：证据曾在旧软件基线下被审阅，基线漂移后结论失效，必须按当前基线重新确认
export const evidenceStatuses = ['missing', 'submitted', 'accepted', 'rejected', 'resubmit', 'reconfirm'] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type EvidenceStatus = (typeof evidenceStatuses)[number];

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
  // 证据被审阅时所依据的软件基线；与项目当前基线不同即表示结论已失效
  reviewedSoftwareVersion?: string;
  // 该证据最终结论由哪个离线补件包带入
  sourcePackageId?: string;
}

export interface ProjectVersion {
  id: string;
  label: string;
  author: string;
  createdAt: string;
  summary: string;
  changes: string[];
  impactedConfigurations: string[];
  // 由离线补件包合并生成时记录包号，便于回溯
  sourcePackageId?: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
  // 幂等键：同一离线补件包的一次逻辑动作（导入/确认/失效）只允许产生一条审计
  packageId?: string;
}

// 已批准项目的冻结快照：批准后写入，任何后续动作只能校验，不能改写
export interface FrozenSnapshot {
  projectId: string;
  status: ProjectStatus;
  maintenanceVersion: string;
  softwareVersion: string;
  frozenAt: string;
  frozenBy: string;
  evidenceCount: number;
  // 快照内容的校验值，导入/编辑时据此判断快照是否被篡改
  checksum: string;
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
  // 当前处于冻结状态的快照（仅已批准且未重新打开时存在）
  frozenSnapshot?: FrozenSnapshot;
  // 历次批准留下的冻结快照历史，重新打开审阅后归档于此，永久保留、不可改写
  frozenHistory?: FrozenSnapshot[];
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

/* ------------------------- 离线补件包与对账 ------------------------- */

// 离线审阅人带回的单条证据审阅结果
export interface OfflineEvidenceEntry {
  evidenceId: string;
  regulationId: string;
  name: string;
  type: EvidenceItem['type'];
  // 文件版本：与网内逐项比较的第一关键字
  fileVersion: string;
  // 该补件依据的软件基线：与网内当前基线比较决定是否失效
  softwareVersion: string;
  configurations: string[];
  decision: Exclude<EvidenceStatus, 'missing' | 'reconfirm'>;
  note: string;
  reviewedAt: string;
  expiryDate?: string;
}

// 离线补件包：在断网环境完成的审阅结果集合
export interface OfflineSupplementPackage {
  packageId: string;
  projectId: string;
  projectName?: string;
  exportedAt: string;
  reviewer: string;
  // 补件包离网时项目采用的软件基线
  baselineSoftwareVersion: string;
  baselineMaintenanceVersion: string;
  evidenceEntries: OfflineEvidenceEntry[];
  note?: string;
}

// 逐项比对后的处置分类
// safe_new       网内缺失，补件可安全新增
// safe_update    文件版本更新且基线一致，补件可安全更新覆盖
// current_newer  网内审阅结果比后到补件更新，当前审阅优先，补件不覆盖
// duplicate      同一文件版本且已有结论，重复提交，跳过
// baseline_conflict 补件依据旧基线，软件基线已变，结论失效需重新确认
// unknown_regulation 补件引用的法规项网内不存在，挂起人工处理
// frozen         项目已批准冻结，任何补件不得写入
export type ReconcileDisposition =
  | 'pending_import'
  | 'safe_new'
  | 'safe_update'
  | 'current_newer'
  | 'duplicate'
  | 'baseline_conflict'
  | 'unknown_regulation'
  | 'frozen';

// 对账条目的最终处置决议（由当前审阅人在页面上确认）
export type ReconcileResolution =
  | 'apply' // 采纳补件
  | 'skip' // 跳过（当前审阅优先 / 重复 / 主动放弃）
  | 'reconfirm'; // 基线已变，按当前基线重新确认后才采纳

export interface ReconcileItem {
  entry: OfflineEvidenceEntry;
  disposition: ReconcileDisposition;
  resolution: ReconcileResolution | null;
  // 导入阶段是否已处理（断点续传的安全点）
  processed: boolean;
  // 冲突情况下记录网内现状，便于页面展示
  onlineVersion?: string;
  onlineSoftwareVersion?: string;
  onlineStatus?: EvidenceStatus;
  onlineReviewedAt?: string;
  reason: string;
}

export type ReconcilePhase = 'comparing' | 'failed' | 'ready' | 'committed';

export interface ReconcileSession {
  sessionId: string;
  packageId: string;
  projectId: string;
  reviewer: string;
  // 补件包离网基线
  offlineBaseline: string;
  // 导入开始时网内当前基线（提交时再校验一次是否又漂移）
  currentBaselineAtImport: string;
  phase: ReconcilePhase;
  items: ReconcileItem[];
  importError: string | null;
  createdAt: string;
  updatedAt: string;
  committedAt?: string;
}

export interface ReconcileConflictSummary {
  packageId: string;
  projectId: string;
  baseline: string;
  items: {
    evidenceId: string;
    name: string;
    regulationId: string;
    disposition: ReconcileDisposition;
    resolution: ReconcileResolution | null;
    reason: string;
  }[];
}

// store.commitReconciliation 的返回结果
export interface ReconcileCommitResult {
  ok: boolean;
  error?: string;
  applied: number;
  reconfirm: number;
  skipped: number;
  unresolved: number;
  auditCreated: boolean;
}
