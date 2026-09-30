<script setup lang="ts">
import { useCertificationStore } from '~/stores/certification';
import { sampleSupplementPackages } from '~/data/sample-packages';
import { baselineLabel } from '~/services/reconcile';
import type {
  ImportSession,
  ReconcileDecision,
  ReconcileOutcome,
  SupplementPackage
} from '~/types/certification';

const store = useCertificationStore();
const busy = ref(false);
const message = ref('');
const error = ref('');
const activeSessionId = ref('');
const customJson = ref('');

onMounted(() => {
  store.hydrate();
  const resumable = store.resumableSessions;
  if (resumable.length) activeSessionId.value = resumable[0].id;
});

const packageOptions = computed(() =>
  sampleSupplementPackages.map((pkg) => ({
    label: `${pkg.packageId} · 项目 ${pkg.projectId}（${pkg.items.length} 项，基线 ${pkg.baseline.softwareVersion}）`,
    value: pkg.packageId
  }))
);
const selectedPackageId = ref(sampleSupplementPackages[0].packageId);

const activeSession = computed(() => store.sessionById(activeSessionId.value));
const activeProject = computed(() =>
  activeSession.value ? store.projectById(activeSession.value.projectId) : undefined
);

const outcomeStyle: Record<ReconcileOutcome, { label: string; tone: string; hint: string }> = {
  safe_update: { label: '安全合并', tone: 'text-green-800 border-green-300 bg-green-50', hint: '同基线下文件版本更新' },
  add_evidence: { label: '随包新增', tone: 'text-teal-800 border-teal-300 bg-teal-50', hint: '当前项目没有该证据' },
  reconfirm: { label: '基线漂移 · 待重认', tone: 'text-amber-900 border-amber-400 bg-amber-50', hint: '软件基线已变更，离线结论失效' },
  review_conflict: { label: '审阅分歧 · 保留当前', tone: 'text-red-900 border-red-300 bg-red-50', hint: '同版本结论不一致，后到结果不覆盖' },
  keep_current: { label: '保留当前', tone: 'text-slate-700 border-slate-300 bg-slate-50', hint: '补件包版本更旧' },
  unchanged: { label: '无变化', tone: 'text-slate-600 border-slate-200 bg-white', hint: '内容与结论一致' }
};

const decisionLabels: Record<ReconcileDecision, string> = {
  apply_package: '采用补件包',
  keep_current: '保留当前',
  reconfirm_review: '内容合并，结论待我重认'
};

function decisionOptions(line: { outcome: ReconcileOutcome; defaultDecision: ReconcileDecision }) {
  if (line.outcome === 'reconfirm') {
    return [
      { label: decisionLabels.reconfirm_review, value: 'reconfirm_review' as const },
      { label: decisionLabels.keep_current, value: 'keep_current' as const }
    ];
  }
  if (line.outcome === 'review_conflict') {
    return [
      { label: decisionLabels.keep_current, value: 'keep_current' as const },
      { label: decisionLabels.apply_package, value: 'apply_package' as const }
    ];
  }
  if (line.outcome === 'add_evidence' || line.outcome === 'safe_update') {
    return [
      { label: decisionLabels.apply_package, value: 'apply_package' as const },
      { label: decisionLabels.keep_current, value: 'keep_current' as const }
    ];
  }
  return [{ label: decisionLabels.keep_current, value: 'keep_current' as const }];
}

function lineDecision(session: ImportSession, line: { key: string; defaultDecision: ReconcileDecision }) {
  return session.draftDecisions[line.key] ?? line.defaultDecision;
}

function setDecision(lineKey: string, value: ReconcileDecision) {
  if (!activeSession.value) return;
  const next = { ...activeSession.value.draftDecisions, [lineKey]: value };
  store.saveImportDraft(activeSession.value.id, next);
}

async function importSelected() {
  message.value = '';
  error.value = '';
  const pkg: SupplementPackage | undefined = sampleSupplementPackages.find(
    (item) => item.packageId === selectedPackageId.value
  );
  if (!pkg) return;
  busy.value = true;
  try {
    const session = await store.startImport(structuredClone(pkg));
    activeSessionId.value = session.id;
    if (session.duplicated) {
      message.value = `补件包 ${pkg.packageId} 已确认过，复用既有记录，不生成第二套审计。`;
    } else if (session.transportAttempts > 1) {
      message.value = `前 ${session.transportAttempts - 1} 次回网链路中断，已用同一补件包立即重试并对账完成。`;
    } else {
      message.value = '补件包上传成功，已按证据版本完成逐项对账。';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '导入失败';
  } finally {
    busy.value = false;
  }
}

async function importCustom() {
  message.value = '';
  error.value = '';
  try {
    const pkg = JSON.parse(customJson.value) as SupplementPackage;
    if (!pkg.packageId || !pkg.projectId || !Array.isArray(pkg.items)) {
      throw new Error('补件包缺少 packageId / projectId / items 字段');
    }
    busy.value = true;
    const session = await store.startImport(pkg);
    activeSessionId.value = session.id;
    message.value = '自定义补件包已上传并完成对账。';
    customJson.value = '';
  } catch (err) {
    error.value = err instanceof Error ? err.message : '补件包解析或上传失败';
  } finally {
    busy.value = false;
  }
}

async function retrySession() {
  if (!activeSession.value) return;
  message.value = '';
  error.value = '';
  busy.value = true;
  try {
    const session = await store.retryImport(activeSession.value.id);
    message.value = session.status === 'awaiting_confirmation'
      ? `重试成功（同一补件包，第 ${session.transportAttempts} 次尝试）。`
      : '仍在重试，请继续使用同一补件包。';
  } catch (err) {
    error.value = err instanceof Error ? err.message : '重试失败';
  } finally {
    busy.value = false;
  }
}

async function confirmSession() {
  if (!activeSession.value) return;
  message.value = '';
  error.value = '';
  busy.value = true;
  try {
    const outcome = await store.confirmImport(activeSession.value.id);
    if (outcome.ok) {
      message.value = '全部变化已一次写入：证据、法规覆盖、冲突与审计已在同一事务内提交。';
    } else {
      error.value = `${outcome.error ?? '确认写入失败'}；已确认 ${outcome.applied} 项保留在安全点，重试不会重做这些项，剩余 ${outcome.remaining} 项。`;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '确认失败';
  } finally {
    busy.value = false;
  }
}

function abandonSession() {
  if (!activeSession.value) return;
  store.abandonImport(activeSession.value.id);
  message.value = '导入会话已放弃，项目数据未发生变化。';
}

function statusBadge(session: ImportSession) {
  switch (session.status) {
    case 'comparing':
      return { text: '传输对账中', cls: 'bg-blue-50 text-blue-800 border-blue-200' };
    case 'awaiting_confirmation':
      return { text: '等待确认', cls: 'bg-amber-50 text-amber-900 border-amber-300' };
    case 'failed':
      return { text: '传输失败 · 可安全点重试', cls: 'bg-red-50 text-red-900 border-red-300' };
    case 'confirmed':
      return { text: '已确认', cls: 'bg-green-50 text-green-800 border-green-300' };
    default:
      return { text: '已放弃', cls: 'bg-slate-100 text-slate-600 border-slate-300' };
  }
}
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-semibold">离线回网补件对账</h1>
    <p class="mt-1 text-sm text-slate-600">
      审阅人携带离线补件包回网合并：先按证据版本逐项比较，能安全合并的更新对应法规覆盖；
      软件基线已被他人改动时离线结论失效重认，后到结果不覆盖当前审阅，确认时一次写入全部变化。
    </p>
  </div>

  <div v-if="message" class="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-900">{{ message }}</div>
  <div v-if="error" class="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-900">{{ error }}</div>

  <section class="mb-6 grid gap-6 xl:grid-cols-2">
    <div class="border border-slate-200 bg-white p-5">
      <h2 class="font-semibold">导入内置离线补件包</h2>
      <p class="mt-1 text-xs text-slate-500">
        SUP-118-OFFLINE-01 前两次回网传输会失败，系统用同一补件包立即重试；SUP-...-DRIFT 演示基线漂移；
        SUP-...-DIVERGENCE 演示审阅分歧与确认中途断连；SUP-092 演示已批准项目冻结保护。
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <USelect v-model="selectedPackageId" :options="packageOptions" class="min-w-[360px]" />
        <UButton color="primary" :loading="busy" @click="importSelected">上传并对账</UButton>
      </div>
    </div>

    <div class="border border-slate-200 bg-white p-5">
      <h2 class="font-semibold">粘贴自定义补件包 JSON</h2>
      <UTextarea v-model="customJson" :rows="4" class="mt-3 font-mono text-xs" placeholder='{"packageId":"...","projectId":"TA-...","baseline":{...},"items":[...]}' />
      <UButton color="gray" class="mt-3" :loading="busy" @click="importCustom">解析并导入</UButton>
    </div>
  </section>

  <section v-if="store.resumableSessions.length" class="mb-6 border border-slate-200 bg-white p-4">
    <h2 class="text-sm font-semibold text-slate-700">未完成的导入（页面重开后从安全点继续）</h2>
    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="session in store.resumableSessions"
        :key="session.id"
        type="button"
        class="rounded border px-3 py-2 text-left text-sm"
        :class="session.id === activeSessionId ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white hover:bg-slate-50'"
        @click="activeSessionId = session.id"
      >
        <span class="font-medium">{{ session.packageId }}</span>
        <span class="ml-2 text-xs text-slate-500">{{ session.projectId }} · 已对账 {{ session.lines.length }} 项</span>
      </button>
    </div>
  </section>

  <section v-if="activeSession" class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4 border border-slate-200 bg-white p-5">
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="text-lg font-semibold">{{ activeSession.packageId }}</h2>
          <span class="rounded border px-2 py-0.5 text-xs" :class="statusBadge(activeSession).cls">{{ statusBadge(activeSession).text }}</span>
        </div>
        <p class="mt-2 text-sm text-slate-600">
          项目 {{ activeSession.projectId }} · 离线审阅人 {{ activeSession.reviewer }} · 导出于 {{ activeSession.exportedAt.slice(0, 16).replace('T', ' ') }}
        </p>
        <p v-if="activeProject" class="mt-1 text-sm">
          补件包导出基线：
          <strong :class="activeProject.softwareVersion !== activeSession.baselineAtExport.softwareVersion ? 'text-amber-700' : ''">
            {{ baselineLabel(activeSession.baselineAtExport.maintenanceVersion, activeSession.baselineAtExport.softwareVersion) }}
          </strong>
          <span v-if="activeProject"> ｜ 当前基线：<strong>{{ baselineLabel(activeProject.maintenanceVersion, activeProject.softwareVersion) }}</strong></span>
        </p>
        <p class="mt-1 text-xs text-slate-500">
          传输尝试 {{ activeSession.transportAttempts }} 次
          <template v-if="activeSession.confirmedAt"> · 确认于 {{ activeSession.confirmedAt.slice(0, 16).replace('T', ' ') }}</template>
          <template v-if="activeSession.auditEntryId"> · 审计 {{ activeSession.auditEntryId }}</template>
        </p>
        <p v-if="activeSession.lastError" class="mt-2 text-sm text-red-800">{{ activeSession.lastError }}</p>
      </div>
      <div v-if="activeSession.status !== 'confirmed' && activeSession.status !== 'abandoned'" class="flex flex-wrap gap-2">
        <UButton v-if="activeSession.status === 'failed'" color="red" variant="soft" :loading="busy" @click="retrySession">
          用同一补件包重试
        </UButton>
        <UButton
          color="primary"
          :loading="busy"
          :disabled="activeSession.status === 'comparing'"
          @click="confirmSession"
        >
          {{ activeSession.status === 'failed' ? '从安全点继续确认' : '一次写入全部变化' }}
        </UButton>
        <UButton color="gray" variant="ghost" @click="abandonSession">放弃导入</UButton>
      </div>
    </div>

    <div v-if="activeProject && activeProject.softwareVersion !== activeSession.baselineAtExport.softwareVersion" class="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      检测到软件基线漂移：另一位审阅人已把基线改为 {{ activeProject.softwareVersion }}。补件包内离线审阅结论不会直接生效，
      相关项已标记为待重认；已有审阅结果同样失效，需在项目页按当前基线重新确认。
    </div>

    <div v-if="activeSession.lines.length" class="overflow-x-auto border border-slate-200 bg-white">
      <table class="data-table min-w-[1180px]">
        <thead>
          <tr>
            <th>证据 / 法规项</th>
            <th>版本逐项比较</th>
            <th>补件包</th>
            <th>当前项目</th>
            <th>处理方式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in activeSession.lines" :key="line.key" :class="line.applied ? 'bg-green-50/50' : ''">
            <td>
              <p class="font-medium">{{ line.name }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ line.regulationId }} · {{ line.configurations.join('、') }}</p>
              <p v-if="line.note" class="mt-1 text-xs text-slate-600">{{ line.note }}</p>
            </td>
            <td>
              <span class="inline-block rounded border px-2 py-1 text-xs font-medium" :class="outcomeStyle[line.outcome].tone">
                {{ outcomeStyle[line.outcome].label }}
              </span>
              <p class="mt-2 max-w-[300px] text-xs text-slate-600">{{ line.reason }}</p>
              <p v-if="line.applied" class="mt-1 text-xs font-medium text-green-700">已写入安全点，重试不重做</p>
            </td>
            <td class="text-xs">
              <p>文件 <strong>{{ line.packageVersion }}</strong> · SW {{ line.packageSoftwareVersion }}</p>
              <p class="mt-1">离线结论：<strong>{{ line.packageDecision }}</strong></p>
            </td>
            <td class="text-xs">
              <p v-if="line.currentVersion">文件 <strong>{{ line.currentVersion }}</strong> · SW {{ line.currentSoftwareVersion }}</p>
              <p v-else class="text-slate-400">（尚无该证据）</p>
              <p v-if="line.currentDecision" class="mt-1">当前审阅：<strong>{{ line.currentDecision }}</strong></p>
            </td>
            <td>
              <div v-if="activeSession.status === 'confirmed'" class="text-xs text-slate-500">
                {{ decisionLabels[lineDecision(activeSession, line)] }}
              </div>
              <select
                v-else
                class="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                :value="lineDecision(activeSession, line)"
                :disabled="Boolean(line.applied)"
                @change="setDecision(line.key, ($event.target as HTMLSelectElement).value as ReconcileDecision)"
              >
                <option v-for="option in decisionOptions(line)" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeSession.status === 'confirmed' && activeProject" class="border border-slate-200 bg-white p-5">
      <h2 class="text-sm font-semibold">导入后状态</h2>
      <div class="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <p class="text-xs text-slate-500">未处理冲突 {{ activeProject.conflicts.filter((c) => !c.resolved).length }} 条</p>
          <ul class="mt-2 space-y-1 text-sm">
            <li v-for="conflict in activeProject.conflicts.filter((c) => !c.resolved)" :key="conflict.id" class="border-l-2 border-red-400 pl-3">
              <strong>{{ conflict.kind === 'baseline_drift' ? '基线漂移' : '审阅分歧' }}</strong>：{{ conflict.description }}
            </li>
            <li v-if="!activeProject.conflicts.filter((c) => !c.resolved).length" class="text-slate-500">无未处理冲突。</li>
          </ul>
        </div>
        <div>
          <UButton color="primary" variant="soft" :to="`/projects/${activeProject.id}`">前往项目页重新确认与审阅</UButton>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
    选择一个离线补件包开始对账；页面关闭后，未确认的选择与进度会保留，重开时从安全点继续。
  </section>
</template>
