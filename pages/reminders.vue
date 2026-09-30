<script setup lang="ts">
import { useCertificationStore } from '~/stores/certification';

const store = useCertificationStore();
onMounted(() => store.hydrate());
const today = new Date('2026-09-29');

const reminders = computed(() =>
  store.projects
    .flatMap((project) => {
      const items = [
        {
          project,
          name: '认证证书',
          expiresAt: project.certificateExpiry,
          status: project.status,
          impact: `${project.configuration} 全部配置`
        },
        ...project.evidence
          .filter((evidence) => evidence.expiryDate)
          .map((evidence) => ({
            project,
            name: evidence.name,
            expiresAt: evidence.expiryDate!,
            status: evidence.status,
            impact: evidence.configurations.join('、')
          }))
      ];
      return items;
    })
    .filter((item) => new Date(item.expiresAt) <= new Date('2027-03-31'))
    .map((item) => ({
      ...item,
      days: Math.ceil((new Date(item.expiresAt).getTime() - today.getTime()) / 86400000)
    }))
    .sort((a, b) => a.days - b.days)
);
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-semibold">证书与证据到期提醒</h1>
    <p class="mt-1 text-sm text-slate-600">按 180 天窗口检查证书、测试报告和豁免材料，明确影响配置与续证动作。</p>
  </div>

  <section class="border border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-4 py-3">
      <h2 class="font-semibold">到期队列</h2>
      <p class="mt-1 text-xs text-slate-500">共 {{ reminders.length }} 项，以 2026-09-29 为基准日。</p>
    </div>
    <div class="overflow-x-auto">
      <table class="data-table min-w-[920px]">
        <thead>
          <tr>
            <th>项目</th>
            <th>到期对象</th>
            <th>到期日</th>
            <th>剩余天数</th>
            <th>影响配置</th>
            <th>动作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reminders" :key="`${item.project.id}-${item.name}`">
            <td>
              <NuxtLink :to="`/projects/${item.project.id}`" class="font-semibold text-teal-700 hover:underline">
                {{ item.project.id }}
              </NuxtLink>
              <p class="mt-1 text-sm text-slate-500">{{ item.project.name }}</p>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.expiresAt }}</td>
            <td>
              <UBadge :color="item.days < 30 ? 'red' : item.days < 90 ? 'amber' : 'blue'" variant="soft">
                {{ item.days }} 天
              </UBadge>
            </td>
            <td>{{ item.impact }}</td>
            <td><UButton size="xs" color="primary" variant="soft" :to="`/projects/${item.project.id}`">检查续证</UButton></td>
          </tr>
          <tr v-if="!reminders.length">
            <td colspan="6" class="py-12 text-center text-slate-500">当前窗口内没有到期对象。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
