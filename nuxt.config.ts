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
  build: {
    transpile: ['gsap'],
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    head: {
      script: [
        {
          innerHTML: `
            (function() {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `,
          type: 'text/javascript',
          tagPosition: 'head'
        }
      ]
    }
  },

  compatibilityDate: '2024-08-12',
})