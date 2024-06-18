<template>
  <div class="relative flex justify-center items-center h-screen">
    <!-- Toggle switch -->
    <div class="absolute top-0 right-0 m-4 p-2">
      <label class="swap swap-flip">
        <input type="checkbox" class="toggle" @click="toggleTheme" />
      </label>
    </div>
    <Metronome/>
    <!-- Your app content here -->
  </div>
</template>

<script setup lang="ts">
import { themes } from './constants'
import { onMounted } from 'vue';
import Metronome from './components/Metronome.vue';


function toggleTheme(){
  const theme = document.documentElement.getAttribute('data-theme');
  setTheme(theme === themes[0] ? themes[1] : themes[0]);
};

function setTheme(theme: string){
  document.documentElement.setAttribute('data-theme', theme);
};

//NOTE: script is executed both client side and Server Side
// Document is undefined on server side, so DOM specific functions must be called after being mounted
onMounted(() => {
    setTheme(themes[0]);
});
</script>
