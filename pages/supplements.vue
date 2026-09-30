<script setup lang="ts">
import { validateEvidenceUpgrade } from '~/services/validators';
import { useCertificationStore } from '~/stores/certification';

const store = useCertificationStore();
const selectedProjectId = ref('');
const selectedEvidence = ref<string[]>([]);
const note = ref('');
const message = ref('');
const error = ref('');

const projectOptions = computed(() =>
  store.projects
    .filter((project) => project.evidence.some((evidence) => ['rejected', 'resubmit', 'missing', 'stale'].includes(evidence.status)))
    .map((project) => ({
      label: `${project.id} · ${project.name}${project.status === 'approved' ? '（已批准冻结）' : ''}`,
      value: project.id
    }))
);

const current = computed(() => store.projects.find((project) => project.id === selectedProjectId.value));
const frozen = computed(() => current.value?.status === 'approved');
const pendingEvidence = computed(
  () => current.value?.evidence.filter((item) => ['rejected', 'resubmit', 'missing', 'stale'].includes(item.status)) ?? []
);

function submit() {
  message.value = '';
  error.value = '';
  if (!current.value) {
    error.value = '请选择需要补件的认证项目';
    return;
  }
  if (frozen.value) {
    error.value = '该项目已批准，冻结快照不可改写，不能再提交补件。';
    return;
  }
  const errors = validateEvidenceUpgrade(current.value, selectedEvidence.value, note.value);
  if (errors.length) {
    error.value = errors.join('；');
    return;
  }
  try {
    const count = store.bulkSupplement(current.value.id, selectedEvidence.value, note.value);
    selectedEvidence.value = [];
    note.value = '';
    message.value = `已完成 ${count} 项证据补件，并同步到项目版本基线，法规覆盖已重算。`;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '批量补件失败';
  }
}

onMounted(() => {
  store.hydrate();
  if (!selectedProjectId.value && projectOptions.value[0]) selectedProjectId.value = projectOptions.value[0].value;
});
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-semibold">批量补件工作区</h1>
    <p class="mt-1 text-sm text-slate-600">将退回项统一更新到当前软件基线，并记录补件范围和影响配置。</p>
  </div>

  <div v-if="message" class="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-900">{{ message }}</div>
  <div v-if="error" class="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-900">{{ error }}</div>

  <div class="grid gap-6 xl:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
    <section class="border border-slate-200 bg-white p-5">
      <UFormGroup label="认证项目">
        <USelect v-model="selectedProjectId" :options="projectOptions" />
      </UFormGroup>
      <div v-if="current" class="mt-5 space-y-3 text-sm">
        <div v-if="frozen" class="border border-green-300 bg-green-50 p-3 text-xs text-green-900">
          该项目已批准冻结，补件入口已停用。
        </div>
        <div>
          <p class="text-slate-500">车型配置</p>
          <p class="mt-1 font-medium">{{ current.modelCode }} · {{ current.configuration }}</p>
        </div>
        <div>
          <p class="text-slate-500">当前版本基线</p>
          <p class="mt-1 font-medium">{{ current.maintenanceVersion }} / SW {{ current.softwareVersion }}</p>
        </div>
        <div>
          <p class="text-slate-500">待补件数量</p>
          <p class="metric-value mt-1 text-2xl font-semibold">{{ pendingEvidence.length }}</p>
        </div>
      </div>
    </section>

    <section class="border border-slate-200 bg-white">
      <div class="border-b border-slate-200 px-4 py-3">
        <h2 class="font-semibold">选择待补件证据</h2>
        <p class="mt-1 text-xs text-slate-500">提交后证据状态变为已提交，软件版本自动更新为项目基线。</p>
      </div>
      <form class="p-4" @submit.prevent="submit">
        <fieldset :disabled="frozen" class="contents">
        <div class="space-y-3">
          <label v-for="item in pendingEvidence" :key="item.id" class="flex gap-3 border border-slate-200 p-4">
            <input v-model="selectedEvidence" type="checkbox" :value="item.id" class="mt-1" />
            <span class="min-w-0 flex-1">
              <span class="flex flex-wrap items-center justify-between gap-2">
                <strong class="text-sm">{{ item.name }}</strong>
                <StatusBadge :status="item.status" />
              </span>
              <span class="mt-2 block text-sm text-slate-600">{{ item.note }}</span>
              <span class="mt-2 block text-xs text-slate-500">
                {{ item.regulationId }} · 文件 {{ item.version }} · 软件 {{ item.softwareVersion }} · {{ item.configurations.join('、') }}
              </span>
            </span>
          </label>
          <p v-if="!pendingEvidence.length" class="py-10 text-center text-sm text-slate-500">没有待补件证据。</p>
        </div>

        <div class="mt-5">
          <UFormGroup label="批量补件说明">
            <UTextarea v-model="note" :rows="4" placeholder="填写新增测试、说明文件、版本核对和配置覆盖结论" />
          </UFormGroup>
        </div>
        <UButton type="submit" color="primary" class="mt-4" :disabled="frozen">提交批量补件</UButton>
        </fieldset>
      </form>
    </section>
  </div>
</template>
