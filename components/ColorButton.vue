<template>
    <button
       class = "h-12 border-2 rounded"
      :class="[currentBorderColor, currentBackgroundColor, currentWidth, { 'bg-opacity-100': isFlashing, 'bg-opacity-0': !isFlashing }]"
      @click="cycleColorAndSound"
    >
      <!-- Empty buton to just show border with color -->
    </button>
  </template>

  <script setup lang="ts">
  import { ref , onMounted } from 'vue';
  import { audioPaths } from "../constants"

  let audioObjects:HTMLAudioElement[] = [];
  
  // Define color classes as typed array of Strings
  const borderColors: string[] = ['border-primary', 'border-secondary', 'border-accent','border-gray-400'];
  const bgColors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent','bg-gray-400'];
  
  const buttonWidths: Record<number, string> = {
    2: 'w-16',
    4: 'w-12',
    8: 'w-8',
    16: 'w-4'
  }
  
  const currentIndex = ref(0);
  const currentSound = ref();
  const isFlashing = ref(false);

  const currentBorderColor = ref(borderColors[currentIndex.value]);
  const currentBackgroundColor = ref(bgColors[currentIndex.value]);
  const currentWidth = ref(buttonWidths[4])
  
  function cycleColorAndSound() {
    currentIndex.value = (currentIndex.value + 1) % borderColors.length;
    currentBorderColor.value = borderColors[currentIndex.value];
    currentBackgroundColor.value = bgColors[currentIndex.value];
    currentSound.value = audioObjects[currentIndex.value];
  }

  function setColorAndSound(index:number){
    currentIndex.value = index;
    currentBorderColor.value = borderColors[currentIndex.value];
    currentBackgroundColor.value = bgColors[currentIndex.value];
    currentSound.value = audioObjects[currentIndex.value];
  }
  
  function tic() {
    isFlashing.value = true;
    if (currentIndex.value !== 3) {
      currentSound.value.play();
    }
    
    setTimeout(() => {
      isFlashing.value = false;
    }, 100); // Flash duration in milliseconds
  }

  function updateWidth(newBeatUnit:number){
    currentWidth.value = buttonWidths[newBeatUnit];
  }

  defineExpose({ tic, cycleColorAndSound, updateWidth });

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
  