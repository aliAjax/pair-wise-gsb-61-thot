<script setup lang="ts">
import { useCertificationStore } from '~/stores/certification';
import { buildSubmissionExport } from '~/services/reconcile';

const store = useCertificationStore();
const selectedProject = ref('all');
const projectOptions = computed(() => [
  { label: '全部项目', value: 'all' },
  ...store.projects.map((project) => ({ label: `${project.id} · ${project.name}`, value: project.id }))
]);

const scopedProjects = computed(() =>
  store.projects.filter((project) => selectedProject.value === 'all' || project.id === selectedProject.value)
);

const entries = computed(() =>
  scopedProjects.value
    .flatMap((project) =>
      project.audit.map((entry) => ({
        ...entry,
        projectId: project.id,
        projectName: project.name
      }))
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
);

const unresolvedCount = computed(() =>
  scopedProjects.value.reduce((sum, project) => sum + project.conflicts.filter((item) => !item.resolved).length, 0)
);

function exportAudit() {
  const payload = {
    generatedAt: new Date().toISOString(),
    scope: selectedProject.value,
    summaryNote:
      unresolvedCount.value > 0
        ? `导出包含 ${unresolvedCount.value} 条未处理冲突（审阅分歧/基线漂移），采用基线见每个项目的 adoptedBaseline。`
        : '导出范围无未处理冲突。',
    projects: scopedProjects.value.map((project) => buildSubmissionExport(project))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'vehicle-type-approval-audit-package.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

onMounted(() => store.hydrate());
</script>

<template>
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-semibold">审计与提交包</h1>
      <p class="mt-1 text-sm text-slate-600">
        保留项目变更、证据失效与重认、离线导入、状态流转的完整轨迹；同一导入重复提交只保留一条幂等审计。
      </p>
    </div>
    <div class="flex flex-wrap items-end gap-3">
      <div class="min-w-[300px]">
        <UFormGroup label="审计范围">
          <USelect v-model="selectedProject" :options="projectOptions" />
        </UFormGroup>
      </div>
      <UButton color="primary" @click="exportAudit">导出提交包</UButton>
    </div>
  </div>

  <section class="mb-5 grid gap-4 md:grid-cols-3">
    <div class="border border-slate-200 bg-white p-4">
      <p class="text-xs text-slate-500">范围内项目</p>
      <p class="metric-value mt-1 text-2xl font-semibold">{{ scopedProjects.length }}</p>
    </div>
    <div class="border border-slate-200 bg-white p-4">
      <p class="text-xs text-slate-500">未处理冲突</p>
      <p class="metric-value mt-1 text-2xl font-semibold" :class="unresolvedCount ? 'text-red-700' : ''">{{ unresolvedCount }}</p>
    </div>
    <div class="border border-slate-200 bg-white p-4">
      <p class="text-xs text-slate-500">冻结项目</p>
      <p class="metric-value mt-1 text-2xl font-semibold">{{ scopedProjects.filter((p) => p.frozenSnapshot).length }}</p>
    </div>
  </section>

  <section v-if="unresolvedCount" class="mb-5 border border-red-200 bg-red-50 p-4">
    <p class="text-sm font-semibold text-red-950">导出将显式标注以下未处理冲突</p>
    <ul class="mt-2 space-y-1 text-sm text-red-900">
      <li
        v-for="conflict in scopedProjects.flatMap((project) => project.conflicts.filter((item) => !item.resolved).map((item) => ({ project, item })))"
        :key="conflict.item.id"
        class="border-l-2 border-red-500 pl-3"
      >
        {{ conflict.project.id }} · {{ conflict.item.evidenceName }}：{{ conflict.item.description }}
      </li>
    </ul>
  </section>

  <section class="border border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-4 py-3">
      <h2 class="font-semibold">审批时间线</h2>
      <p class="mt-1 text-xs text-slate-500">共 {{ entries.length }} 条记录</p>
    </div>
    <div class="space-y-5 p-5">
      <article v-for="entry in entries" :key="entry.id" class="audit-item">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-medium">{{ entry.action }} · {{ entry.actor }}</p>
          <span class="text-xs text-slate-500">{{ entry.createdAt.slice(0, 16).replace('T', ' ') }}</span>
        </div>
        <p class="mt-1 text-sm text-slate-600">{{ entry.detail }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ entry.projectId }} · {{ entry.projectName }}</p>
      </article>
      <p v-if="!entries.length" class="py-10 text-center text-sm text-slate-500">没有符合条件的审计记录。</p>
    </div>
  </section>
</template>
