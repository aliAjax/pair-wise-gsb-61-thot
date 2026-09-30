<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  note: string;
}>();
</script>

<template>
  <article class="border border-slate-200 bg-white p-4">
    <p class="text-sm text-slate-500">{{ label }}</p>
    <p class="metric-value mt-2 text-3xl font-semibold text-slate-950">{{ value }}</p>
    <p class="mt-2 text-xs text-slate-500">{{ note }}</p>
  </article>
</template>
