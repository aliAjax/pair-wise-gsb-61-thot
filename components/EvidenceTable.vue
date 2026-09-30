<script setup lang="ts">
import type { EvidenceItem, EvidenceStatus } from '~/types/certification';

const props = defineProps<{
  evidence: EvidenceItem[];
  editable?: boolean;
  baseline?: string;
}>();

const emit = defineEmits<{
  update: [evidenceId: string, status: EvidenceStatus];
}>();

const typeLabels: Record<EvidenceItem['type'], string> = {
  test_report: '测试报告',
  part_list: '部件清单',
  software_report: '软件报告',
  exemption: '豁免材料',
  certificate: '证书'
};

function stale(item: EvidenceItem) {
  if (!props.baseline) return false;
  return item.softwareVersion !== props.baseline || (item.reviewedSoftwareVersion ?? item.softwareVersion) !== props.baseline;
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="data-table min-w-[980px]">
      <thead>
        <tr>
          <th>证据文件</th>
          <th>法规项</th>
          <th>文件 / 软件版本</th>
          <th>配置覆盖</th>
          <th>状态</th>
          <th>审阅说明</th>
          <th v-if="editable">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in evidence" :key="item.id">
          <td>
            <p class="font-medium">{{ item.name }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ typeLabels[item.type] }} · {{ item.id }}</p>
          </td>
          <td class="font-mono text-sm">{{ item.regulationId }}</td>
          <td>
            <p>文件 {{ item.version }}</p>
            <p class="mt-1 text-xs" :class="stale(item) ? 'font-medium text-red-700' : 'text-slate-500'">
              软件 {{ item.softwareVersion }}
              <span v-if="item.reviewedSoftwareVersion && item.reviewedSoftwareVersion !== item.softwareVersion">
                （结论基线 {{ item.reviewedSoftwareVersion }}）
              </span>
            </p>
          </td>
          <td class="max-w-[260px] text-sm">{{ item.configurations.join('、') }}</td>
          <td><StatusBadge :status="item.status" /></td>
          <td class="max-w-[320px] text-sm text-slate-600">{{ item.note }}</td>
          <td v-if="editable">
            <div class="flex min-w-[180px] flex-wrap gap-2">
              <UButton size="xs" color="green" variant="soft" @click="emit('update', item.id, 'accepted')">接受</UButton>
              <UButton size="xs" color="red" variant="soft" @click="emit('update', item.id, 'rejected')">拒绝</UButton>
              <UButton size="xs" color="amber" variant="soft" @click="emit('update', item.id, 'resubmit')">重新抽样</UButton>
              <UButton
                v-if="item.status === 'reconfirm'"
                size="xs"
                color="purple"
                variant="soft"
                @click="emit('update', item.id, 'accepted')"
              >按当前基线重认</UButton>
            </div>
          </td>
        </tr>
        <tr v-if="!evidence.length">
          <td :colspan="editable ? 7 : 6" class="py-12 text-center text-slate-500">当前项目尚未关联证据。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
