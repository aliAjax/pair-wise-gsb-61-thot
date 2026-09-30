<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { certificationApi } from '~/services/certification-api';
import type { ProjectFilters, ProjectStatus } from '~/types/certification';
import { useCertificationStore } from '~/stores/certification';

const store = useCertificationStore();
const queryClient = useQueryClient();
const filters = reactive<ProjectFilters>({
  query: '',
  status: 'all',
  agency: 'all',
  risk: 'all'
});

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '草稿', value: 'draft' },
  { label: '已提交', value: 'submitted' },
  { label: '审阅中', value: 'under_review' },
  { label: '待补件', value: 'supplement_required' },
  { label: '已批准', value: 'approved' },
  { label: '已拒绝', value: 'rejected' }
];

const riskOptions = [
  { label: '全部关注项', value: 'all' },
  { label: '证书临近到期', value: 'expiring' },
  { label: '法规覆盖缺失', value: 'missing' },
  { label: '软件版本冲突', value: 'version_conflict' }
];

const agencyOptions = computed(() => [
  { label: '全部机构', value: 'all' },
  ...store.agencies.map((agency) => ({ label: agency, value: agency }))
]);

const { data, isPending, isError, refetch } = useQuery({
  queryKey: computed(() => ['projects', filters]),
  queryFn: () => certificationApi.listProjects({ ...filters })
});

const projectRows = computed(() => data.value ?? []);
const openCount = computed(() => store.projects.filter((project) => !['approved', 'rejected'].includes(project.status)).length);
const supplementCount = computed(() => store.projects.filter((project) => project.status === 'supplement_required').length);
const versionConflictCount = computed(() =>
  store.projects.filter((project) =>
    project.evidence.some((evidence) => evidence.softwareVersion !== project.softwareVersion)
  ).length
);
const expiringCount = computed(() =>
  store.projects.filter((project) => new Date(project.certificateExpiry) <= new Date('2026-12-31')).length
);

function riskLabel(project: (typeof projectRows.value)[number]) {
  if (project.evidence.some((item) => item.softwareVersion !== project.softwareVersion)) return '软件版本冲突';
  if (project.regulations.some((item) => item.status !== 'complete')) return '法规覆盖缺失';
  if (new Date(project.certificateExpiry) <= new Date('2026-12-31')) return '证书临近到期';
  return '未见阻断项';
}

async function invalidateAndRefetch() {
  await queryClient.invalidateQueries({ queryKey: ['projects'] });
  await refetch();
}

onMounted(() => {
  store.hydrate();
  void invalidateAndRefetch();
});
</script>

<template>
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="text-sm font-medium text-teal-700">型式认证运营</p>
      <h1 class="mt-1 text-2xl font-semibold">认证证据包工作台</h1>
      <p class="mt-2 text-sm text-slate-600">按车型、配置、法规项目和维护版本组织证据，控制缺失、错配与补件闭环。</p>
    </div>
    <UButton to="/projects/new" color="primary" icon="i-heroicons-plus">新建认证项目</UButton>
  </div>

  <section class="workspace-grid mb-6">
    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
      <StatTile label="开放认证项目" :value="openCount" note="草稿、审阅和补件队列" />
    </div>
    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
      <StatTile label="待补件项目" :value="supplementCount" note="认证机构已退回要求补件" />
    </div>
    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
      <StatTile label="版本冲突" :value="versionConflictCount" note="证据软件版本与申报基线不一致" />
    </div>
    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
      <StatTile label="90 天内到期" :value="expiringCount" note="证书或批准文件临近失效" />
    </div>
  </section>

  <section class="mb-5 border border-slate-200 bg-white p-4">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <UFormGroup label="关键词">
        <UInput v-model="filters.query" placeholder="项目号、车型、配置或软件版本" />
      </UFormGroup>
      <UFormGroup label="审批状态">
        <USelect v-model="filters.status" :options="statusOptions" />
      </UFormGroup>
      <UFormGroup label="认证机构">
        <USelect v-model="filters.agency" :options="agencyOptions" />
      </UFormGroup>
      <UFormGroup label="风险筛选">
        <USelect v-model="filters.risk" :options="riskOptions" />
      </UFormGroup>
    </div>
    <div class="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
      <span>筛选结果 {{ projectRows.length }} 项</span>
      <span>全部项目 {{ store.projects.length }} 项</span>
      <span>本地数据已启用</span>
    </div>
  </section>

  <section class="border border-slate-200 bg-white">
    <div v-if="isPending" class="p-10 text-center text-slate-500">正在读取认证项目索引…</div>
    <div v-else-if="isError" class="p-10 text-center text-red-700">认证项目索引读取失败。</div>
    <div v-else class="overflow-x-auto">
      <table class="data-table min-w-[1120px]">
        <thead>
          <tr>
            <th>认证项目</th>
            <th>车型 / 配置</th>
            <th>版本基线</th>
            <th>状态</th>
            <th>完整性</th>
            <th>关键风险</th>
            <th>机构 / 审阅人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projectRows" :key="project.id">
            <td>
              <NuxtLink :to="`/projects/${project.id}`" class="font-semibold text-teal-700 hover:underline">
                {{ project.id }}
              </NuxtLink>
              <p class="mt-1 max-w-[280px] text-sm text-slate-600">{{ project.name }}</p>
            </td>
            <td>
              <p class="font-medium">{{ project.modelCode }} · {{ project.vehicleType }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ project.configuration }}</p>
            </td>
            <td>
              <p>{{ project.maintenanceVersion }}</p>
              <p class="mt-1 font-mono text-xs text-slate-500">SW {{ project.softwareVersion }}</p>
            </td>
            <td><StatusBadge :status="project.status" /></td>
            <td class="min-w-[150px]">
              <div class="flex items-center gap-3">
                <UProgress :value="project.progress" size="xs" class="min-w-[80px]" />
                <span class="metric-value text-sm">{{ project.progress }}%</span>
              </div>
            </td>
            <td class="text-sm">{{ riskLabel(project) }}</td>
            <td>
              <p>{{ project.agency }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ project.reviewer }}</p>
            </td>
            <td><UButton size="xs" color="primary" variant="soft" :to="`/projects/${project.id}`">打开审阅</UButton></td>
          </tr>
          <tr v-if="!projectRows.length">
            <td colspan="8" class="py-12 text-center text-slate-500">没有符合当前条件的认证项目。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
