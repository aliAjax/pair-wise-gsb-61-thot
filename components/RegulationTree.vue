<script setup lang="ts">
import type { EvidenceItem, RegulationItem } from '~/types/certification';

const props = defineProps<{
  regulations: RegulationItem[];
  evidence: EvidenceItem[];
}>();

const expanded = ref<string[]>(props.regulations.map((item) => item.id));

function toggle(id: string) {
  expanded.value = expanded.value.includes(id)
    ? expanded.value.filter((item) => item !== id)
    : [...expanded.value, id];
}

function linkedEvidence(id: string) {
  return props.evidence.filter((item) => item.regulationId === id);
}
</script>

<template>
  <div class="divide-y divide-slate-200 border-y border-slate-200 bg-white">
    <section v-for="regulation in regulations" :key="regulation.id">
      <button
        type="button"
        class="flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50"
        @click="toggle(regulation.id)"
      >
        <span class="min-w-0">
          <span class="flex flex-wrap items-center gap-2">
            <strong class="font-mono text-sm">{{ regulation.code }}</strong>
            <UBadge color="gray" variant="soft">{{ regulation.category }}</UBadge>
            <UBadge
              :color="regulation.status === 'complete' ? 'green' : regulation.status === 'conflict' ? 'red' : 'amber'"
              variant="soft"
            >
              {{ regulation.status === 'complete' ? '完整' : regulation.status === 'conflict' ? '版本冲突' : '缺失' }}
            </UBadge>
          </span>
          <span class="mt-1 block text-sm font-medium text-slate-800">{{ regulation.title }}</span>
        </span>
        <span class="shrink-0 text-sm text-slate-500">{{ regulation.coverage }}% · {{ expanded.includes(regulation.id) ? '收起' : '展开' }}</span>
      </button>

      <div v-if="expanded.includes(regulation.id)" class="border-t border-slate-100 bg-slate-50 px-4 py-4">
        <div class="mb-3">
          <div class="mb-1 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>配置覆盖</span><span>{{ regulation.coverage }}%</span>
          </div>
          <UProgress :value="regulation.coverage" size="xs" />
        </div>

        <div v-if="regulation.issues.length" class="mb-4 space-y-1">
          <p v-for="issue in regulation.issues" :key="issue" class="border-l-2 border-amber-500 pl-3 text-sm text-amber-900">
            {{ issue }}
          </p>
        </div>

        <div v-if="linkedEvidence(regulation.id).length" class="space-y-2">
          <div
            v-for="item in linkedEvidence(regulation.id)"
            :key="item.id"
            class="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-3 py-3"
          >
            <div>
              <p class="text-sm font-medium">{{ item.name }}</p>
              <p class="mt-1 text-xs text-slate-500">
                文件版本 {{ item.version }} · 软件 {{ item.softwareVersion }} · {{ item.configurations.join('、') }}
              </p>
            </div>
            <StatusBadge :status="item.status" />
          </div>
        </div>
        <p v-else class="text-sm text-slate-500">尚未关联证据文件。</p>
      </div>
    </section>
  </div>
</template>
