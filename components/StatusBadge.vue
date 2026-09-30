<script setup lang="ts">
import type { EvidenceStatus, ProjectStatus } from '~/types/certification';

defineProps<{
  status: ProjectStatus | EvidenceStatus;
}>();

const labels: Record<ProjectStatus | EvidenceStatus, string> = {
  draft: '草稿',
  submitted: '已提交',
  under_review: '审阅中',
  supplement_required: '待补件',
  approved: '已批准',
  rejected: '已拒绝',
  missing: '缺失',
  accepted: '已接受',
  resubmit: '需重交',
  reconfirm: '基线已变待重认'
};

const colors: Record<ProjectStatus | EvidenceStatus, 'gray' | 'blue' | 'amber' | 'green' | 'red' | 'purple'> = {
  draft: 'gray',
  submitted: 'blue',
  under_review: 'blue',
  supplement_required: 'amber',
  approved: 'green',
  rejected: 'red',
  missing: 'gray',
  accepted: 'green',
  resubmit: 'amber',
  reconfirm: 'purple'
};
</script>

<template>
  <UBadge :color="colors[status]" variant="soft">{{ labels[status] }}</UBadge>
</template>
