<script setup lang="ts">
const route = useRoute();

const navItems = [
  { to: '/', label: '认证项目' },
  { to: '/regulations', label: '法规项目树' },
  { to: '/imports', label: '离线回网对账' },
  { to: '/supplements', label: '批量补件' },
  { to: '/reminders', label: '到期提醒' },
  { to: '/audit', label: '审计记录' }
];

function active(path: string) {
  if (path === '/') return route.path === '/' || route.path.startsWith('/projects');
  return route.path.startsWith(path);
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-3 lg:px-6">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 font-semibold text-white">
            认
          </span>
          <span class="min-w-0">
            <strong class="block truncate text-sm text-slate-900">汽车型式认证证据包审阅与补件平台</strong>
            <span class="block text-xs text-slate-500">Type Approval Evidence Control / Nuxt 3</span>
          </span>
        </NuxtLink>

        <nav class="order-3 flex w-full gap-1 overflow-x-auto lg:order-none lg:ml-auto lg:w-auto" aria-label="主导航">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium"
            :class="active(item.to) ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="ml-auto hidden items-center gap-3 lg:flex">
          <div class="text-right">
            <p class="text-xs text-slate-500">当前角色</p>
            <p class="text-sm font-medium">认证机构审阅人</p>
          </div>
          <UBadge color="teal" variant="soft">在线</UBadge>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-[1600px] px-4 py-5 lg:px-6 lg:py-7">
      <slot />
    </main>
  </div>
</template>
