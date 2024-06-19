<template>
    <button
       class = "w-12 h-12 border-2 rounded"
      :class="[currentBorderColor, currentBackgroundColor, { 'bg-opacity-100': isFlashing, 'bg-opacity-0': !isFlashing }]"
      @click="cycleColorAndSound"
    >
      <!-- Empty buton to just show border with color -->
    </button>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Define color classes as typed array of Strings

  const borderColors: string[] = ['border-primary', 'border-secondary', 'border-accent'];
  const bgColors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent'];
  const sounds = ['/path/to/sound/file1.mp3', '/path/to/sound/file2.mp3', '/path/to/sound/file3.mp3']
  
  const currentIndex = ref(0);
  const currentBorderColor = ref(borderColors[currentIndex.value]);
  const currentBackgroundColor = ref(bgColors[currentIndex.value]);
  const currentSound = ref(sounds[currentIndex.value]);
  const isFlashing = ref(false);
  
  function cycleColorAndSound() {
    currentIndex.value = (currentIndex.value + 1) % borderColors.length;
    currentBorderColor.value = borderColors[currentIndex.value];
    currentBackgroundColor.value = bgColors[currentIndex.value];
    currentSound.value = sounds[currentIndex.value];
  }
  
  function tic() {
    isFlashing.value = true;
    console.log(`Tic! ${currentSound.value} played`)
    // const audio = new Audio('/path/to/sound/file.mp3');
    // audio.play();
    
    setTimeout(() => {
      isFlashing.value = false;
    }, 100); // Flash duration in milliseconds
  }

  defineExpose({ tic });
  </script>
  
  <style scoped>
  .bg-opacity-0 {
    background-color: transparent;
  }
  .bg-opacity-100 {
    background-color: currentBackgroundColor;
  }
  </style>
  