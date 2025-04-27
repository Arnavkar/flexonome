// https://nuxt.com/docs/api/configuration/nuxt-config
import { visualizer } from 'rollup-plugin-visualizer'
import analyzer from 'rollup-plugin-analyzer'

export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
  ],

  modules: ['nuxt-snackbar', '@nuxtjs/supabase', 'nuxt-lucide-icons'],

  supabase: {
    redirect:false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/', '/auth/login', '/auth/confirm'],
    },
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

  vite: {
    // 1) Add the Visualizer as a Vite plugin
    plugins: [
      visualizer({
        filename: 'stats.html',  // output file (project root)
        open: true,              // launch in browser when build finishes
        gzipSize: true,          // include gzipped sizes in the report
        brotliSize: true         // include brotli sizes too
      })
    ],
    // 2) Hook the Analyzer into Rollup’s build step
    build: {
      rollupOptions: {
        plugins: [
          analyzer({
            summaryOnly: true,   // just totals per chunk
            limit: 10            // top 10 largest modules
          })
        ]
      }
    }
  },

  compatibilityDate: '2024-08-12',
})