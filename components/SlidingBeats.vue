<template>
    <div class="flex flex-col gap-4 border-2 border-dashed border-primary">
        <ColorButton v-for="(bpm, index) in bpms" :key="index" :style="bounceStyle(index)" class="w-10 h-10 rounded-lg bounce"></ColorButton>
    </div>
  </template>
    
  <script setup lang="ts">
  import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
  import ColorButton from './ColorButton.vue';
  
  const props = defineProps<{
    bpms: number[];
    isRunning: boolean;
  }>();
  
  // Compute the duration in seconds based on the BPM
  const durations = computed(() => props.bpms.map(bpm => 60*2 / bpm));
  // Create a style object for the bounce animation

  function bounceStyle(index:number){
    return({
      '--bounce-duration': `${durations.value[index]}s`,
      '--animation-state': props.isRunning? 'running' : 'start'
    });
  };

  </script>
  
  <style scoped>
  .bounce {
    animation: left-right var(--bounce-duration) var(--animation-state) infinite;
    animation-timing-function: ease-out;
  }
  
  @keyframes left-right {
    0% {
      transform: translateX(0%);
    }
    50% {
      transform: translateX(40vw);
    }
    100% {
      transform: translateX(0%);
    }
  }
  </style>