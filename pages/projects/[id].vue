<script setup lang="ts">
import type { EvidenceStatus, ProjectInput, ProjectStatus } from '~/types/certification';
import { validateEvidenceUpgrade, validateProjectInput, validateSubmission } from '~/services/validators';
import { useCertificationStore } from '~/stores/certification';

const route = useRoute();
const store = useCertificationStore();
onMounted(() => store.hydrate());
const id = String(route.params.id);
const project = computed(() => store.projectById(id));
const activeTab = ref(0);
const message = ref('');
const error = ref('');

const editor = reactive<ProjectInput>({
  name: '',
  modelCode: '',
  vehicleType: '',
  configuration: '',
  maintenanceVersion: '',
  softwareVersion: '',
  applicant: '',
  agency: '',
  certificateExpiry: ''
});

watch(
  project,
  (value) => {
    if (!value) return;
    Object.assign(editor, {
      name: value.name,
      modelCode: value.modelCode,
      vehicleType: value.vehicleType,
      configuration: value.configuration,
      maintenanceVersion: value.maintenanceVersion,
      softwareVersion: value.softwareVersion,
      applicant: value.applicant,
      agency: value.agency,
      certificateExpiry: value.certificateExpiry
    });
  },
  { immediate: true }
);

const transitionStatus = ref<ProjectStatus>('under_review');
const transitionReason = ref('');
const editReason = ref('');
const supplementNote = ref('');
const selectedEvidence = ref<string[]>([]);

const tabs = [
  { label: '证据文件', icon: 'i-heroicons-document-text' },
  { label: '法规项目', icon: 'i-heroicons-list-bullet' },
  { label: '版本与影响', icon: 'i-heroicons-arrows-right-left' },
  { label: '审计记录', icon: 'i-heroicons-clock' }
];

const frozen = computed(() => project.value?.status === 'approved');
const unresolvedConflicts = computed(() => project.value?.conflicts.filter((item) => !item.resolved) ?? []);
const staleEvidence = computed(() => project.value?.evidence.filter((item) => item.status === 'stale') ?? []);

const transitionOptions = computed(() => {
  const current = project.value?.status;
  if (current === 'draft') return [{ label: '提交认证机构', value: 'submitted' }];
  if (current === 'submitted') return [{ label: '开始审阅', value: 'under_review' }];
  if (current === 'under_review') {
    return [
      { label: '要求补件', value: 'supplement_required' },
      { label: '批准', value: 'approved' },
      { label: '拒绝', value: 'rejected' }
    ];
  }
  if (current === 'supplement_required') return [{ label: '重新提交补件', value: 'submitted' }];
  return [{ label: '重新打开审阅', value: 'under_review' }];
});

const blockingIssues = computed(() => (project.value ? validateSubmission(project.value) : []));

function saveEditor() {
  message.value = '';
  error.value = '';
  const errors = validateProjectInput(editor);
  if (Object.keys(errors).length) {
    error.value = Object.values(errors)[0] ?? '项目资料校验失败';
    return;
  }
  if (!editReason.value.trim()) {
    error.value = '请填写本次变更原因';
    return;
  }
  const softwareChanged = editor.softwareVersion !== project.value?.softwareVersion;
  try {
    store.updateProject(id, { ...editor }, editReason.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : '保存失败';
    return;
  }
  editReason.value = '';
  message.value = '项目资料与版本影响已保存。';
  if (softwareChanged) {
    message.value += ' 软件基线发生变化，已有审阅结果已失效并在证据页等待重新确认。';
    activeTab.value = 0;
  }
}

function transition() {
  if (!project.value) return;
  message.value = '';
  error.value = '';
  if (!transitionReason.value.trim()) {
    error.value = '请填写审批流转依据';
    return;
  }
  if (transitionStatus.value === 'approved' && blockingIssues.value.length) {
    error.value = `存在阻断项，不能批准：${blockingIssues.value.join('；')}`;
    return;
  }
  try {
    store.transition(
      id,
      transitionStatus.value,
      project.value.reviewer === '待分派' ? '认证机构审阅人' : project.value.reviewer,
      transitionReason.value
    );
  } catch (err) {
    error.value = err instanceof Error ? err.message : '流转失败';
    return;
  }
  transitionReason.value = '';
  message.value = '审批状态已更新。';
}

function updateEvidence(evidenceId: string, status: EvidenceStatus) {
  if (!project.value) return;
  message.value = '';
  error.value = '';
  try {
    const item = project.value.evidence.find((entry) => entry.id === evidenceId);
    store.updateEvidence(id, evidenceId, status, `审阅人按基线 ${project.value.softwareVersion} 将证据标记为${status}${item ? `；${item.name}` : ''}`);
  } catch (err) {
    error.value = err instanceof Error ? err.message : '审阅更新失败';
    return;
  }
  message.value = '证据审阅状态已更新，法规覆盖已同步重算。';
}

function bulkSupplement() {
  if (!project.value) return;
  message.value = '';
  error.value = '';
  const errors = validateEvidenceUpgrade(project.value, selectedEvidence.value, supplementNote.value);
  if (errors.length) {
    error.value = errors.join('；');
    return;
  }
  try {
    const count = store.bulkSupplement(id, selectedEvidence.value, supplementNote.value);
    selectedEvidence.value = [];
    supplementNote.value = '';
    message.value = `已将 ${count} 项证据更新至当前软件基线并重新提交。`;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '批量补件失败';
  }
}
</script>

<template>
  <div v-if="!project" class="border border-red-200 bg-red-50 p-6 text-red-900">
    未找到认证项目 {{ id }}。
  </div>

  <template v-else>
    <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <NuxtLink to="/" class="text-sm text-teal-700 hover:underline">返回认证项目</NuxtLink>
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-semibold">{{ project.id }}</h1>
          <StatusBadge :status="project.status" />
          <UBadge v-if="frozen" color="green" variant="solid">冻结快照</UBadge>
        </div>
        <p class="mt-2 text-lg font-medium">{{ project.name }}</p>
        <p class="mt-1 text-sm text-slate-500">
          {{ project.modelCode }} · {{ project.vehicleType }} · {{ project.configuration }} · {{ project.maintenanceVersion }} / SW {{ project.softwareVersion }}
        </p>
      </div>
      <div class="min-w-[240px] border border-slate-200 bg-white p-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">证据完整度</span>
          <span class="metric-value font-semibold">{{ project.progress }}%</span>
        </div>
        <UProgress class="mt-2" :value="project.progress" size="sm" />
        <p class="mt-2 text-xs text-slate-500">证书到期：{{ project.certificateExpiry }}</p>
      </div>
    </div>

    <div v-if="frozen" class="mb-5 border border-green-300 bg-green-50 p-4">
      <p class="text-sm font-semibold text-green-950">该项目已批准，冻结快照不可改写</p>
      <p class="mt-1 text-sm text-green-900">
        批准基线 {{ project.frozenSnapshot?.maintenanceVersion }} / SW {{ project.frozenSnapshot?.softwareVersion }}
        （{{ project.frozenSnapshot?.frozenAt.slice(0, 16).replace('T', ' ') }} 锁定）。
        证据审阅、基线变更、批量补件与离线导入均已停用；如需变更请建立新的变更项目。
      </p>
    </div>

    <div v-if="staleEvidence.length && !frozen" class="mb-5 border border-orange-300 bg-orange-50 p-4">
      <p class="text-sm font-semibold text-orange-950">软件基线变更后 {{ staleEvidence.length }} 项审阅结果失效</p>
      <ul class="mt-2 list-inside list-disc space-y-1 text-sm text-orange-900">
        <li v-for="item in staleEvidence" :key="item.id">
          {{ item.name }}：原结论「{{ item.reviewDecision }}」基于 {{ item.reviewedBaseline }}，请在 SW {{ project.softwareVersion }} 下重新确认
        </li>
      </ul>
    </div>

    <div v-if="unresolvedConflicts.length" class="mb-5 border border-red-200 bg-red-50 p-4">
      <p class="text-sm font-semibold text-red-950">{{ unresolvedConflicts.length }} 条未处理冲突</p>
      <ul class="mt-2 space-y-1 text-sm text-red-900">
        <li v-for="conflict in unresolvedConflicts" :key="conflict.id" class="border-l-2 border-red-500 pl-3">
          <strong>{{ conflict.kind === 'baseline_drift' ? '基线漂移' : '审阅分歧' }}</strong>：{{ conflict.description }}
        </li>
      </ul>
      <p class="mt-2 text-xs text-red-800">未处理冲突会阻断批准，并在导出提交包中明确标注。</p>
    </div>

    <div v-if="message" class="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-900">{{ message }}</div>
    <div v-if="error" class="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-900">{{ error }}</div>
    <div v-if="blockingIssues.length && !frozen" class="mb-5 border border-amber-200 bg-amber-50 p-4">
      <p class="text-sm font-semibold text-amber-950">批准前阻断项</p>
      <ul class="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">
        <li v-for="issue in blockingIssues" :key="issue">{{ issue }}</li>
      </ul>
    </div>

    <section class="mb-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div class="border border-slate-200 bg-white p-5">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="font-semibold">项目与版本基线</h2>
            <p class="mt-1 text-xs text-slate-500">变更会生成新版本并标记受影响配置；软件基线变化将使已有审阅结论失效。</p>
          </div>
        </div>
        <form class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" @submit.prevent="saveEditor">
          <fieldset :disabled="frozen" class="contents">
            <UFormGroup label="项目名称"><UInput v-model="editor.name" /></UFormGroup>
            <UFormGroup label="车型代码"><UInput v-model="editor.modelCode" /></UFormGroup>
            <UFormGroup label="配置"><UInput v-model="editor.configuration" /></UFormGroup>
            <UFormGroup label="维护版本"><UInput v-model="editor.maintenanceVersion" /></UFormGroup>
            <UFormGroup label="软件版本"><UInput v-model="editor.softwareVersion" /></UFormGroup>
            <UFormGroup label="证书有效期"><UInput v-model="editor.certificateExpiry" type="date" /></UFormGroup>
            <UFormGroup label="申请主体"><UInput v-model="editor.applicant" /></UFormGroup>
            <UFormGroup label="认证机构"><UInput v-model="editor.agency" /></UFormGroup>
            <UFormGroup label="变更原因"><UInput v-model="editReason" placeholder="说明变更和影响范围" /></UFormGroup>
            <div class="md:col-span-2 xl:col-span-3">
              <UButton type="submit" color="primary" :disabled="frozen">保存并生成版本</UButton>
            </div>
          </fieldset>
        </form>
      </div>

      <div class="border border-slate-200 bg-white p-5">
        <h2 class="font-semibold">审批流转</h2>
        <p class="mt-1 text-xs text-slate-500">批准前系统检查缺失证据、失效重认、未处理冲突、版本错配和配置覆盖；批准时冻结快照。</p>
        <form class="mt-4 space-y-4" @submit.prevent="transition">
          <UFormGroup label="目标状态">
            <USelect v-model="transitionStatus" :options="transitionOptions" :disabled="frozen" />
          </UFormGroup>
          <UFormGroup label="流转依据">
            <UTextarea v-model="transitionReason" :rows="3" placeholder="记录接受、拒绝或补件依据" :disabled="frozen" />
          </UFormGroup>
          <UButton type="submit" color="primary" class="w-full justify-center" :disabled="frozen">提交审批流转</UButton>
        </form>
      </div>
    </section>

    <UTabs v-model="activeTab" :items="tabs" class="mb-5" />

    <section v-if="activeTab === 0" class="border border-slate-200 bg-white">
      <div class="border-b border-slate-200 px-4 py-3">
        <h2 class="font-semibold">证据文件审阅</h2>
        <p class="mt-1 text-xs text-slate-500">逐项接受、拒绝或要求重新抽样；标记为待重认的证据须按当前软件基线重新确认。</p>
      </div>
      <EvidenceTable
        :evidence="project.evidence"
        :baseline-software-version="project.softwareVersion"
        :frozen="frozen"
        editable
        @update="updateEvidence"
      />
    </section>

    <section v-else-if="activeTab === 1">
      <div class="mb-4">
        <h2 class="font-semibold">法规项目覆盖</h2>
        <p class="mt-1 text-sm text-slate-500">覆盖随证据审阅、补件导入与基线变化即时重算。</p>
      </div>
      <RegulationTree :regulations="project.regulations" :evidence="project.evidence" />
    </section>

    <section v-else-if="activeTab === 2" class="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div class="border border-slate-200 bg-white">
        <div class="border-b border-slate-200 px-4 py-3">
          <h2 class="font-semibold">版本差异</h2>
        </div>
        <div class="divide-y divide-slate-200">
          <article v-for="version in project.versions" :key="version.id" class="p-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="font-medium">{{ version.label }} · {{ version.author }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ version.createdAt.slice(0, 16).replace('T', ' ') }}</p>
              </div>
              <UBadge color="gray" variant="soft">{{ version.impactedConfigurations.join('、') }}</UBadge>
            </div>
            <p class="mt-3 text-sm">{{ version.summary }}</p>
            <ul class="mt-2 list-inside list-disc text-sm text-slate-600">
              <li v-for="change in version.changes" :key="change">{{ change }}</li>
            </ul>
          </article>
        </div>
      </div>

      <div class="border border-slate-200 bg-white p-5">
        <h2 class="font-semibold">批量补件</h2>
        <p class="mt-1 text-xs text-slate-500">将缺失、被拒、待重交或基线失效的证据更新到当前软件基线。</p>
        <form class="mt-4 space-y-4" @submit.prevent="bulkSupplement">
          <label
            v-for="item in project.evidence.filter((evidence) => ['rejected', 'resubmit', 'missing', 'stale'].includes(evidence.status))"
            :key="item.id"
            class="flex gap-3 border border-slate-200 p-3"
          >
            <input v-model="selectedEvidence" type="checkbox" :value="item.id" class="mt-1" :disabled="frozen" />
            <span>
              <span class="block text-sm font-medium">{{ item.name }}</span>
              <span class="mt-1 block text-xs text-slate-500">{{ item.id }} · 当前 SW {{ item.softwareVersion }}</span>
            </span>
          </label>
          <p v-if="!project.evidence.some((evidence) => ['rejected', 'resubmit', 'missing', 'stale'].includes(evidence.status))" class="text-sm text-slate-500">
            当前没有待补件证据。
          </p>
          <UFormGroup label="补件说明">
            <UTextarea v-model="supplementNote" :rows="3" placeholder="说明已完成的测试、配置覆盖和版本更新" :disabled="frozen" />
          </UFormGroup>
          <UButton type="submit" color="primary" class="w-full justify-center" :disabled="frozen">批量更新并重新提交</UButton>
        </form>
      </div>
    </section>

    <section v-else class="border border-slate-200 bg-white p-5">
      <h2 class="font-semibold">项目审计记录</h2>
      <div class="mt-5 space-y-5">
        <article v-for="entry in project.audit" :key="entry.id" class="audit-item">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm font-medium">{{ entry.action }} · {{ entry.actor }}</p>
            <span class="text-xs text-slate-500">{{ entry.createdAt.slice(0, 16).replace('T', ' ') }}</span>
          </div>
          <p class="mt-1 text-sm text-slate-600">{{ entry.detail }}</p>
        </article>
      </div>
    </section>
  </template>
</template>
