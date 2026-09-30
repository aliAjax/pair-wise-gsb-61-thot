<script setup lang="ts">
import { useCertificationStore } from '~/stores/certification';
import { useReconcileStore } from '~/stores/reconcile';
import { validatePackage } from '~/services/reconcile';
import { buildSamplePackages } from '~/data/sample-packages';
import type {
  OfflineSupplementPackage,
  ReconcileConflictSummary,
  ReconcileDisposition,
  ReconcileItem,
  ReconcileResolution,
  ReconcileSession
} from '~/types/certification';

const projectStore = useCertificationStore();
const reconcileStore = useReconcileStore();

const selectedProjectId = ref<string>('TA-2026-118');
const packageText = ref('');
const message = ref('');
const error = ref('');
const failureMode = ref(false);
const actor = ref('刘珊');

const projectOptions = computed(() =>
  projectStore.projects.map((project) => ({ label: `${project.id} · ${project.name}`, value: project.id }))
);

const project = computed(() => projectStore.projectById(selectedProjectId.value));

// 页面重开后从上次安全点继续；已提交会话也保留在页面上以便查看与导出
const activeSession = computed<ReconcileSession | undefined>(() =>
  reconcileStore.latestByProject(selectedProjectId.value)
);
const openSession = computed<ReconcileSession | undefined>(() =>
  reconcileStore.activeByProject(selectedProjectId.value)
);
const committedSessions = computed(() => reconcileStore.committedByProject(selectedProjectId.value));

const samples = computed(() => buildSamplePackages());
const sampleOptions = computed(() => [
  { label: '示例：安全合并 / 当前审阅优先 / 重复（SUP-118-SAFE）', value: 'safe' },
  { label: '示例：软件基线漂移需重新确认（SUP-118-BASELINE）', value: 'baseline' },
  { label: '示例：已批准项目冻结（SUP-092-FROZEN）', value: 'frozen' }
]);

function loadSample(key: string) {
  const sample = samples.value[key];
  if (!sample) return;
  packageText.value = JSON.stringify(sample, null, 2);
  selectedProjectId.value = sample.projectId;
  message.value = '已载入示例补件包，可直接开始逐项对账。';
  error.value = '';
}

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  packageText.value = await file.text();
  message.value = `已读取补件包文件 ${file.name}。`;
  error.value = '';
}

function startImport(simulate = false) {
  message.value = '';
  error.value = '';
  const result = validatePackage(packageText.value);
  if (!result.ok) {
    error.value = `补件包校验失败：${result.error}`;
    return;
  }
  const pkg: OfflineSupplementPackage = result.value;
  selectedProjectId.value = pkg.projectId;
  if (!projectStore.projectById(pkg.projectId)) {
    error.value = `补件包项目 ${pkg.projectId} 在当前工作台不存在`;
    return;
  }
  try {
    const session = reconcileStore.startImport(pkg, { simulateFailure: simulate, failAfter: 2 });
    if (session.phase === 'failed') error.value = session.importError ?? '导入中断';
    else if (session.phase === 'ready') message.value = '逐项对账完成，请逐条确认处置后再一次性提交。';
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '导入失败';
  }
}

// 导入失败后用同一补件包重试，已处理部分不重做
function retryImport() {
  if (!activeSession.value) return;
  message.value = '';
  error.value = '';
  const session = reconcileStore.runImport(activeSession.value.sessionId, { simulateFailure: failureMode.value, failAfter: 2 });
  if (session.phase === 'failed') error.value = session.importError ?? '导入再次中断';
  else message.value = '断点续传完成：已处理部分未重做，剩余补件全部对账完毕。';
}

function toggleFailureMode() {
  failureMode.value = !failureMode.value;
  reconcileStore.setFailureMode(failureMode.value);
}

const dispositionMeta: Record<ReconcileDisposition, { label: string; color: string; hint: string }> = {
  pending_import: { label: '导入中', color: 'gray', hint: '' },
  safe_new: { label: '可安全新增', color: 'green', hint: '采纳后新增证据并更新覆盖' },
  safe_update: { label: '可安全更新', color: 'green', hint: '采纳后覆盖网内旧版本并更新对应法规覆盖' },
  current_newer: { label: '当前审阅优先', color: 'blue', hint: '网内审阅更新，后到补件不能覆盖' },
  duplicate: { label: '重复提交', color: 'gray', hint: '同版本同结论，跳过且不产生第二套审计' },
  baseline_conflict: { label: '基线冲突·需重认', color: 'purple', hint: '软件基线已变，离线结论失效，必须按当前基线重新确认' },
  unknown_regulation: { label: '法规缺失·挂起', color: 'amber', hint: '引用法规网内不存在，需人工核对' },
  frozen: { label: '已冻结禁止写入', color: 'red', hint: '项目已批准，冻结快照不可改写' }
};

function allowedResolutions(item: ReconcileItem): { label: string; value: ReconcileResolution }[] {
  switch (item.disposition) {
    case 'safe_new':
    case 'safe_update':
      return [
        { label: '采纳补件', value: 'apply' },
        { label: '跳过', value: 'skip' }
      ];
    case 'current_newer':
    case 'duplicate':
      return [{ label: '保留当前结果（跳过）', value: 'skip' }];
    case 'baseline_conflict':
    case 'unknown_regulation':
      return [
        { label: '按当前基线重新确认', value: 'reconfirm' },
        { label: '挂起不处理', value: 'skip' }
      ];
    default:
      return [];
  }
}

function setResolution(item: ReconcileItem, resolution: ReconcileResolution) {
  if (!activeSession.value) return;
  reconcileStore.setResolution(activeSession.value.sessionId, item.entry.evidenceId, resolution);
}

const unresolvedCount = computed(
  () =>
    activeSession.value?.items.filter(
      (item) => item.disposition !== 'frozen' && !item.resolution
    ).length ?? 0
);
const willApply = computed(
  () => activeSession.value?.items.filter((item) => item.resolution === 'apply').length ?? 0
);
const willReconfirm = computed(
  () => activeSession.value?.items.filter((item) => item.resolution === 'reconfirm').length ?? 0
);
const willSkip = computed(
  () => activeSession.value?.items.filter((item) => item.resolution === 'skip' || item.disposition === 'frozen').length ?? 0
);

function commit() {
  message.value = '';
  error.value = '';
  if (!activeSession.value) return;
  if (!actor.value.trim()) {
    error.value = '请填写确认人（当前审阅人）';
    return;
  }
  if (unresolvedCount.value) {
    error.value = `还有 ${unresolvedCount.value} 条未处置，确认前必须逐条给出决议`;
    return;
  }
  const result = projectStore.commitReconciliation(activeSession.value, actor.value.trim());
  if (!result.ok) {
    error.value = result.error ?? '确认失败，所有变化均未写入';
    return;
  }
  reconcileStore.markCommitted(activeSession.value.sessionId);
  message.value = result.auditCreated
    ? `确认完成并一次性写入：采纳 ${result.applied} 项，${result.reconfirm} 项失效待重认，跳过 ${result.skipped} 项；审计与版本各生成一条。`
    : '该补件包此前已确认过，本次未重复写入、未生成第二套审计。';
}

// 导出对账说明：标明采用的基线与未处理冲突
function exportStatement(session: ReconcileSession) {
  const currentProject = projectStore.projectById(session.projectId);
  const summary: ReconcileConflictSummary = {
    packageId: session.packageId,
    projectId: session.projectId,
    baseline: currentProject?.softwareVersion ?? session.currentBaselineAtImport,
    items: session.items.map((item) => ({
      evidenceId: item.entry.evidenceId,
      name: item.entry.name,
      regulationId: item.entry.regulationId,
      disposition: item.disposition,
      resolution: item.resolution,
      reason: item.reason
    }))
  };
  const payload = {
    generatedAt: new Date().toISOString(),
    packageId: session.packageId,
    projectId: session.projectId,
    offlineBaseline: session.offlineBaseline,
    adoptedBaseline: currentProject
      ? {
          maintenanceVersion: currentProject.maintenanceVersion,
          softwareVersion: currentProject.softwareVersion
        }
      : null,
    committed: session.phase === 'committed',
    unresolvedConflicts: summary.items.filter((item) => item.disposition === 'baseline_conflict' || item.disposition === 'unknown_regulation' || !item.resolution),
    items: summary.items
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `reconcile-${session.packageId}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function abandon() {
  if (!activeSession.value) return;
  reconcileStore.abandon(activeSession.value.sessionId);
  message.value = '已放弃当前对账安全点。';
}

onMounted(() => {
  projectStore.hydrate();
  reconcileStore.hydrate();
});
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-semibold">离线补件回网对账</h1>
    <p class="mt-1 max-w-4xl text-sm text-slate-600">
      离线审阅人带回补件包后，先按证据文件版本与网内逐项比较：能安全合并的更新对应法规覆盖；软件基线已变时，离线结论失效并转入重新确认；
      网内审阅更新时保留当前结果，后到结论不覆盖。确认时一次性写入全部变化，重复提交不产生第二套审计；已批准项目的冻结快照不可改写。
    </p>
  </div>

  <div v-if="message" class="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-900">{{ message }}</div>
  <div v-if="error" class="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-900">{{ error }}</div>

  <section class="mb-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)]">
    <div class="border border-slate-200 bg-white p-5">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-semibold">1. 选择补件包</h2>
        <div class="flex items-center gap-2">
          <USelect model-value="" :options="sampleOptions" class="w-[360px]" @update:model-value="loadSample" />
          <label class="cursor-pointer rounded border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">
            导入 .json
            <input type="file" accept="application/json,.json" class="hidden" @change="onFile" />
          </label>
        </div>
      </div>
      <UTextarea v-model="packageText" :rows="12" class="font-mono text-xs" placeholder="粘贴离线补件包 JSON，或载入示例 / 导入文件" />
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <UButton color="primary" @click="startImport(false)">开始逐项对账</UButton>
        <UButton color="amber" variant="soft" @click="startImport(true)">模拟导入中断后对账</UButton>
        <label class="flex items-center gap-2 text-xs text-slate-600">
          <input v-model="failureMode" type="checkbox" @change="toggleFailureMode" />
          故障注入：让“重试”也在 2 条后中断（演示安全点续传）
        </label>
      </div>
    </div>

    <div class="space-y-6">
      <div class="border border-slate-200 bg-white p-5">
        <h2 class="font-semibold">2. 目标项目与基线</h2>
        <div class="mt-3">
          <UFormGroup label="认证项目">
            <USelect v-model="selectedProjectId" :options="projectOptions" />
          </UFormGroup>
        </div>
        <div v-if="project" class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-500">当前维护版本</span><span class="font-medium">{{ project.maintenanceVersion }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">当前软件基线</span><span class="font-mono font-medium">SW {{ project.softwareVersion }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">审批状态</span><StatusBadge :status="project.status" /></div>
          <div v-if="project.frozenSnapshot" class="mt-2 border border-green-200 bg-green-50 p-2 text-xs text-green-800">
            冻结快照校验值：{{ project.frozenSnapshot.checksum }}
          </div>
        </div>
      </div>

      <div v-if="openSession" class="border border-purple-200 bg-purple-50 p-5">
        <h2 class="font-semibold text-purple-950">页面重开已恢复安全点</h2>
        <p class="mt-1 text-xs text-purple-900">
          补件包 {{ openSession.packageId }}：离网基线 SW {{ openSession.offlineBaseline }}，
          已处理 {{ openSession.items.filter((i) => i.processed).length }}/{{ openSession.items.length }} 条，
          状态「{{ openSession.phase === 'failed' ? '导入中断' : openSession.phase === 'ready' ? '待确认' : '比对中' }}」。
        </p>
      </div>
    </div>
  </section>

  <section v-if="activeSession" class="border border-slate-200 bg-white">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
      <div>
        <h2 class="font-semibold">逐项对账结果（补件包 {{ activeSession.packageId }}）</h2>
        <p class="mt-1 text-xs text-slate-500">
          离网基线 SW {{ activeSession.offlineBaseline }} · 网内基线 SW {{ project?.softwareVersion }}
          · 导入状态：{{ activeSession.phase === 'failed' ? '中断，待重试' : activeSession.phase === 'ready' ? '比对完成，待确认' : activeSession.phase === 'committed' ? '已确认' : '比对中' }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton v-if="activeSession.phase === 'failed'" color="amber" @click="retryImport">用同一补件包重试（已处理不重做）</UButton>
        <UButton color="gray" variant="soft" @click="exportStatement(activeSession)">导出对账说明（含基线与未处理冲突）</UButton>
        <UButton v-if="activeSession.phase !== 'committed'" color="red" variant="ghost" @click="abandon">放弃安全点</UButton>
      </div>
    </div>

    <div v-if="activeSession.phase === 'failed'" class="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {{ activeSession.importError }}
    </div>

    <div class="overflow-x-auto">
      <table class="data-table min-w-[1120px]">
        <thead>
          <tr>
            <th>证据 / 法规</th>
            <th>文件版本（离线 → 网内）</th>
            <th>软件基线</th>
            <th>处置分类与原因</th>
            <th>当前审阅人决议</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activeSession.items" :key="item.entry.evidenceId" :class="item.processed ? '' : 'opacity-40'">
            <td>
              <p class="font-medium">{{ item.entry.name }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ item.entry.evidenceId }} · {{ item.entry.regulationId }}</p>
            </td>
            <td>
              <p>离线 {{ item.entry.fileVersion }} <span class="text-slate-400">→</span> 网内 {{ item.onlineVersion ?? '（无）' }}</p>
              <p class="mt-1 text-xs text-slate-500">离线结论：{{ item.entry.decision }} · {{ item.entry.reviewedAt.slice(0, 10) }}</p>
            </td>
            <td>
              <p class="font-mono text-xs">{{ item.entry.softwareVersion }}</p>
              <p v-if="item.onlineSoftwareVersion && item.onlineSoftwareVersion !== item.entry.softwareVersion" class="mt-1 text-xs font-medium text-purple-700">
                网内 {{ item.onlineSoftwareVersion }}
              </p>
            </td>
            <td class="max-w-[420px]">
              <UBadge :color="dispositionMeta[item.disposition].color as 'gray' | 'green' | 'blue' | 'purple' | 'amber' | 'red'" variant="soft">
                {{ dispositionMeta[item.disposition].label }}
              </UBadge>
              <p class="mt-1 text-xs text-slate-600">{{ item.reason }}</p>
            </td>
            <td class="min-w-[220px]">
              <div v-if="activeSession.phase === 'committed'" class="text-xs text-slate-600">
                已{{ item.resolution === 'apply' ? '采纳' : item.resolution === 'reconfirm' ? '转重新确认' : '跳过' }}
              </div>
              <div v-else-if="allowedResolutions(item).length" class="flex flex-col gap-2">
                <UButton
                  v-for="option in allowedResolutions(item)"
                  :key="option.value"
                  size="xs"
                  :variant="item.resolution === option.value ? 'solid' : 'soft'"
                  :color="option.value === 'apply' ? 'green' : option.value === 'reconfirm' ? 'purple' : 'gray'"
                  @click="setResolution(item, option.value)"
                >{{ option.label }}</UButton>
              </div>
              <span v-else class="text-xs text-red-700">冻结，不可处理</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-4 py-4">
      <div class="flex flex-wrap gap-4 text-sm text-slate-600">
        <span>待决议 <strong class="text-red-700">{{ unresolvedCount }}</strong></span>
        <span>将采纳 <strong class="text-green-700">{{ willApply }}</strong></span>
        <span>转重新确认 <strong class="text-purple-700">{{ willReconfirm }}</strong></span>
        <span>将跳过/冻结 <strong>{{ willSkip }}</strong></span>
      </div>
      <div class="flex items-center gap-3">
        <UFormGroup label="确认人（当前审阅人）" class="w-[220px]">
          <UInput v-model="actor" />
        </UFormGroup>
        <UButton color="primary" size="lg" :disabled="activeSession.phase !== 'ready'" @click="commit">
          一次性确认全部变化
        </UButton>
      </div>
    </div>
  </section>

  <section v-if="committedSessions.length" class="mt-6 border border-slate-200 bg-white p-5">
    <h2 class="font-semibold">本项目已确认补件包</h2>
    <ul class="mt-3 space-y-2 text-sm">
      <li v-for="session in committedSessions" :key="session.sessionId" class="flex flex-wrap items-center justify-between gap-2 border border-slate-100 p-3">
        <span>
          <span class="font-medium">{{ session.packageId }}</span>
          <span class="ml-2 text-xs text-slate-500">离网 SW {{ session.offlineBaseline }} · 确认于 {{ session.committedAt?.slice(0, 16).replace('T', ' ') }}</span>
        </span>
        <UButton size="xs" variant="soft" @click="exportStatement(session)">导出对账说明</UButton>
      </li>
    </ul>
  </section>
</template>
