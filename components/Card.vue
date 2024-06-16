<template>
    <div class="relative flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-80 h-96">
      <button @click="toggleSidebar" class="absolute top-0 left-0 m-2 p-2 bg-blue-500 text-white rounded">
        ☰
      </button>
      <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-10" @click="closeSidebar"></div>
      <div
        v-if="isSidebarOpen"
        class="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-20 transition-transform transform"
        :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }"
      >
        <!-- Sidebar content here -->
        <div class="p-4">
          <h2 class="text-xl font-bold">Sidebar</h2>
          <p>Sidebar content goes here.</p>
        </div>
      </div>
      <slot></slot>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'Card',
    setup() {
      const isSidebarOpen = ref(false);
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      const closeSidebar = () => {
        isSidebarOpen.value = false;
      };
  
      return {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  