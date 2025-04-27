/** @type {import('tailwindcss').Config} */
import { themes } from './constants.ts'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line
    require("@tailwindcss/typography"),
    // eslint-disable-next-line
    require('daisyui')
  ],
  daisyui: {
    themes: themes
  },
  corePlugins: {
    float: false,
    container: false,
    aspectRatio: false
  },
  safelist: [],
  darkMode: ['class', `[data-theme=${themes[0]}]`]
}

