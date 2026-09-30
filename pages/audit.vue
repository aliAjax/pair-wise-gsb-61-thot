<script setup lang="ts">
import { useCertificationStore } from '~/stores/certification';

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

// 未处理冲突：基线漂移后失效待重认的证据、软件版本与当前基线不一致的证据，以及未完整覆盖的法规项
function unhandledConflicts(project: (typeof scopedProjects.value)[number]) {
  const evidenceConflicts = project.evidence.filter(
    (item) =>
      item.status === 'reconfirm' ||
      item.softwareVersion !== project.softwareVersion ||
      (item.reviewedSoftwareVersion ?? item.softwareVersion) !== project.softwareVersion
  );
  const regulationConflicts = project.regulations.filter((item) => item.status !== 'complete');
  return {
    baselineDriftEvidence: evidenceConflicts.map((item) => ({
      evidenceId: item.id,
      name: item.name,
      regulationId: item.regulationId,
      status: item.status,
      evidenceSoftwareVersion: item.softwareVersion,
      reviewedSoftwareVersion: item.reviewedSoftwareVersion ?? item.softwareVersion,
      adoptedSoftwareVersion: project.softwareVersion
    })),
    incompleteRegulations: regulationConflicts.map((item) => ({
      regulationId: item.id,
      code: item.code,
      status: item.status,
      coverage: item.coverage,
      issues: item.issues
    }))
  };
}

function exportAudit() {
  const payload = {
    generatedAt: new Date().toISOString(),
    scope: selectedProject.value,
    exportNote: '提交包标注每个项目采用的软件/维护基线、冻结快照校验值，以及尚未处理的基线冲突与法规覆盖缺口。',
    projects: scopedProjects.value.map((project) => ({
      id: project.id,
      status: project.status,
      // 导出明确标明采用的基线
      adoptedBaseline: {
        maintenanceVersion: project.maintenanceVersion,
        softwareVersion: project.softwareVersion
      },
      frozenSnapshot: project.frozenSnapshot ?? null,
      versions: project.versions,
      evidence: project.evidence,
      // 未处理冲突单独成节
      unhandledConflicts: unhandledConflicts(project),
      audit: project.audit
    }))
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
      <p class="mt-1 text-sm text-slate-600">保留项目变更、证据审阅、状态流转、基线失效和离线补件合并的完整轨迹。</p>
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

  <section class="mb-5 grid gap-4 md:grid-cols-2">
    <div v-for="project in scopedProjects" :key="project.id" class="border border-slate-200 bg-white p-4 text-sm">
      <div class="flex items-center justify-between">
        <p class="font-semibold">{{ project.id }} · {{ project.name }}</p>
        <StatusBadge :status="project.status" />
      </div>
      <p class="mt-2 text-xs text-slate-500">
        采用基线：{{ project.maintenanceVersion }} / SW <span class="font-mono">{{ project.softwareVersion }}</span>
      </p>
      <p v-if="project.frozenSnapshot" class="mt-1 text-xs text-green-700">
        已冻结 · 校验值 {{ project.frozenSnapshot.checksum }}
      </p>
      <p class="mt-1 text-xs text-slate-500">
        未处理基线冲突 {{ unhandledConflicts(project).baselineDriftEvidence.length }} 项 ·
        未完整法规 {{ unhandledConflicts(project).incompleteRegulations.length }} 项
      </p>
    </div>
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
        <p class="mt-1 text-xs text-slate-500">
          {{ entry.projectId }} · {{ entry.projectName }}
          <span v-if="entry.packageId" class="ml-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono">{{ entry.packageId }}</span>
        </p>
      </article>
      <p v-if="!entries.length" class="py-10 text-center text-sm text-slate-500">没有符合条件的审计记录。</p>
    </div>
  </section>
</template>
