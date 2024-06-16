<template>
  <div>
    <!-- Toggle switch -->
    <div class="absolute top-0 right-0 m-4 p-2">
      <label class="swap swap-flip">
        <input type="checkbox" class="toggle" @click="toggleTheme" />
      </label>
    </div>

    <!-- Your app content here -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'dark'
    };
  },
  mounted() {
    // Initially set the theme
    this.setTheme(this.theme);
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      this.setTheme(this.theme);
    },
    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
};
</script>
