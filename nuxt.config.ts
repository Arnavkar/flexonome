// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],

  modules: ['nuxt-snackbar', 'nuxt-mdi'],

  snackbar: {
    bottom: true,
    right: true,
    duration: 5000
  },

  mdi: {
    componentName: 'MdiIcon',
    defaultSize: '5em'
  },
  
  pages: true,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  compatibilityDate: '2024-08-12',
})