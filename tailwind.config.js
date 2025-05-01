/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  plugins: [
    // eslint-disable-next-line
    require("@tailwindcss/typography"),
    // eslint-disable-next-line
    require('daisyui')
  ],
  daisyui: {
    themes: ['night', 'winter']
  },
  corePlugins: {
    float: false,
    container: false,
    aspectRatio: false
  },
  darkMode: ['class', `[data-theme="night"]`]
}

