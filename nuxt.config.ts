export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: false
  },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      title: '汽车型式认证证据包审阅平台',
      meta: [
        {
          name: 'description',
          content: '汽车型式认证证据包、法规项、版本差异和补件审批工作台'
        }
      ]
    }
  },
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },
  ui: {
    global: true
  },
  typescript: {
    strict: true,
    // Keep production builds deterministic; CI runs `npm run typecheck` separately.
    typeCheck: false
  }
});
