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
  import { ref , onMounted } from 'vue';

  const audioPaths:string[] = ['./Low.mp3', './Mid.mp3', './High.mp3']
  let audioObjects:HTMLAudioElement[] = [];
  
  // Define color classes as typed array of Strings
  const borderColors: string[] = ['border-primary', 'border-secondary', 'border-accent'];
  const bgColors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent'];
  
  const currentIndex = ref(0);
  const currentBorderColor = ref(borderColors[currentIndex.value]);
  const currentBackgroundColor = ref(bgColors[currentIndex.value]);
  const currentSound = ref();
  const isFlashing = ref(false);
  
  function cycleColorAndSound() {
    currentIndex.value = (currentIndex.value + 1) % borderColors.length;
    currentBorderColor.value = borderColors[currentIndex.value];
    currentBackgroundColor.value = bgColors[currentIndex.value];
    currentSound.value = audioObjects[currentIndex.value];
  }
  
  function tic() {
    isFlashing.value = true;
    currentSound.value.play();
    
    setTimeout(() => {
      isFlashing.value = false;
    }, 100); // Flash duration in milliseconds
  }

  defineExpose({ tic, cycleColorAndSound });

  onMounted(() => {
    audioObjects = audioPaths.map(path => new Audio(path));
    currentSound.value = audioObjects[0];
  });
  </script>
  
  <style scoped>
  .bg-opacity-0 {
    background-color: transparent;
  }
  .bg-opacity-100 {
    background-color: currentBackgroundColor;
  }
  </style>
  