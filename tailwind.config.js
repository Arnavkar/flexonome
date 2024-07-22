/** @type {import('tailwindcss').Config} */
import { themes } from './constants.ts'

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('daisyui')
  ],
  daisyui: {
    themes: themes
  },
  safelist: [
    {
      pattern: /w-.+/,
    }
  ],
  darkMode: ['class', `[data-theme=${themes[0]}]`]
}