import { defineStore } from 'pinia';
import { buildReconcileItems } from '~/services/reconcile';
import type { OfflineSupplementPackage, ReconcileItem, ReconcileSession } from '~/types/certification';
import { useCertificationStore } from './certification';

const STORAGE_KEY = 'vehicle-type-approval-reconcile-sessions-v1';

function makeId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`;
}

function loadSessions(): ReconcileSession[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ReconcileSession[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 模拟离线包回网导入时的传输故障：仅在故障开关打开且尚未到达断点时抛出。
// 每处理一条都先落盘安全点，因此故障后用“同一补件包”重试时已处理部分不会重做。
export interface ImportOptions {
  simulateFailure?: boolean;
  failAfter?: number;
}

export const useReconcileStore = defineStore('reconcile', {
  state: () => ({
    sessions: loadSessions() as ReconcileSession[],
    hydrated: false,
    failureMode: false
  }),

  getters: {
    // 每个项目只保留一个活动会话（未提交）；已提交会话由 committedByProject 归档
    activeByProject: (state) => (projectId: string) =>
      state.sessions.find((session) => session.projectId === projectId && session.phase !== 'committed'),
    // 最近一次会话（含已提交），用于确认后仍在页面展示结果与导出入口
    latestByProject: (state) => (projectId: string) =>
      state.sessions.find((session) => session.projectId === projectId),
    committedByProject: (state) => (projectId: string) =>
      state.sessions.filter((session) => session.projectId === projectId && session.phase === 'committed')
  },

  actions: {
    hydrate() {
      if (this.hydrated) return;
      this.sessions = loadSessions();
      this.hydrated = true;
    },

    persist() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions));
      }
    },

    setFailureMode(enabled: boolean) {
      this.failureMode = enabled;
    },

    // 同一补件包重复提交：恢复既有会话而不是另建一套（审计也不会重复生成）
    findByPackageId(packageId: string) {
      return this.sessions.find((session) => session.packageId === packageId);
    },

    // 开始或恢复一次导入对账，返回活动会话。
    startImport(pkg: OfflineSupplementPackage, options: ImportOptions = {}): ReconcileSession {
      const projectStore = useCertificationStore();
      const project = projectStore.projectById(pkg.projectId);
      if (!project) throw new Error(`补件包项目 ${pkg.projectId} 在当前工作台不存在`);

      const existing = this.findByPackageId(pkg.packageId);
      if (existing) {
        // 重复提交同一补件包：直接复用会话，不生成第二套比对结果
        return existing;
      }

      // 同一项目已有进行中的对账（不同补件包）时，要求先确认或放弃，避免并行覆盖
      const open = this.activeByProject(pkg.projectId);
      if (open) {
        throw new Error(`项目 ${pkg.projectId} 已有进行中的对账 ${open.packageId}，请先确认或放弃后再导入新补件包`);
      }

      const items = buildReconcileItems(pkg, project);
      const session: ReconcileSession = {
        sessionId: makeId('RC'),
        packageId: pkg.packageId,
        projectId: pkg.projectId,
        reviewer: pkg.reviewer,
        offlineBaseline: pkg.baselineSoftwareVersion,
        currentBaselineAtImport: project.softwareVersion,
        phase: 'comparing',
        items,
        importError: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.sessions.unshift(session);
      this.runImport(session.sessionId, options);
      return session;
    },

    // 执行（或继续）逐项导入。已处理的条目直接跳过，保证断点续传。
    runImport(sessionId: string, options: ImportOptions = {}): ReconcileSession {
      const session = this.sessions.find((item) => item.sessionId === sessionId);
      if (!session) throw new Error('对账会话不存在');
      const projectStore = useCertificationStore();
      const project = projectStore.projectById(session.projectId);
      if (!project) throw new Error('对账项目已不存在');

      session.phase = 'comparing';
      session.importError = null;
      const failAfter = options.failAfter ?? 2;
      let newlyProcessed = 0;

      for (const item of session.items) {
        if (item.processed) continue; // 已确认处理的部分不重做
        // 重新基于当前网内状态核对处置分类（基线可能在等待期间又变化）
        const fresh = buildReconcileItems(
          {
            packageId: session.packageId,
            projectId: session.projectId,
            exportedAt: '',
            reviewer: session.reviewer,
            baselineSoftwareVersion: session.offlineBaseline,
            baselineMaintenanceVersion: '',
            evidenceEntries: [item.entry]
          },
          project
        )[0];
        item.disposition = fresh.disposition;
        item.reason = fresh.reason;
        item.onlineVersion = fresh.onlineVersion;
        item.onlineSoftwareVersion = fresh.onlineSoftwareVersion;
        item.onlineStatus = fresh.onlineStatus;
        item.onlineReviewedAt = fresh.onlineReviewedAt;
        item.processed = true;
        this.persist(); // 每处理一条立即写入安全点
        newlyProcessed += 1;

        if ((options.simulateFailure ?? this.failureMode) && newlyProcessed >= failAfter) {
          session.phase = 'failed';
          session.importError = `导入在处理 ${newlyProcessed} 条后中断（模拟网络/服务故障），已处理部分已保存为安全点，请用同一补件包重试。`;
          session.updatedAt = new Date().toISOString();
          this.persist();
          return session;
        }
      }

      session.phase = 'ready';
      session.updatedAt = new Date().toISOString();
      this.persist();
      return session;
    },

    // 当前审阅人对单条条目给出处置决议
    setResolution(sessionId: string, evidenceId: string, resolution: ReconcileItem['resolution']) {
      const session = this.sessions.find((item) => item.sessionId === sessionId);
      if (!session) return;
      const item = session.items.find((entry) => entry.entry.evidenceId === evidenceId);
      if (!item) return;
      item.resolution = resolution;
      session.updatedAt = new Date().toISOString();
      this.persist();
    },

    markCommitted(sessionId: string) {
      const session = this.sessions.find((item) => item.sessionId === sessionId);
      if (!session) return;
      session.phase = 'committed';
      session.committedAt = new Date().toISOString();
      session.updatedAt = session.committedAt;
      this.persist();
    },

    abandon(sessionId: string) {
      this.sessions = this.sessions.filter((item) => item.sessionId !== sessionId);
      this.persist();
    }
  }
});
