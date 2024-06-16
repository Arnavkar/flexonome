<template>
  <div class="relative flex justify-center items-center h-screen">
    <!-- Toggle switch -->
    <div class="absolute top-0 right-0 m-4 p-2">
      <label class="swap swap-flip">
        <input type="checkbox" class="toggle" @click="toggleTheme" />
      </label>
    </div>
    <Card>
      <CircularDial />
    </Card>

    <!-- Your app content here -->
  </div>
</template>


export default defineComponent({
  name: 'App',
  components: {
    CircularDial,
  },
});
<script>
import CircularDial from './components/CircularDial.vue';
import Card from './components/Card.vue';

export default {
  components: {
    CircularDial,
    Card
  },
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
