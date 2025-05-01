// https://nuxt.com/docs/api/configuration/nuxt-config
import { visualizer } from 'rollup-plugin-visualizer'
import analyzer from 'rollup-plugin-analyzer'

export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
  ],

  modules: ['nuxt-snackbar', '@nuxtjs/supabase', 'nuxt-lucide-icons'],

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/', '/auth/login', '/auth/confirm'],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'none',
      secure: true
    }
  },

  lucide: {
    namePrefix: 'Icon'
  },

  snackbar: {
    bottom: true,
    right: true,
    duration: 5000
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
              document.documentElement.setAttribute('data-theme', 'night');
            })();
          `,
          type: 'text/javascript',
          tagPosition: 'head'
        }
      ]
    }
  },

  vite: {
    plugins: [
      visualizer({
        filename: 'stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ],
    build: {
      rollupOptions: {
        plugins: [
          analyzer({
            summaryOnly: true,
            limit: 10
          })
        ]
      }
    }
  },

  compatibilityDate: '2024-08-12',
})