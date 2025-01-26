<template>
    <div class="flex flex-col gap-4">
        <ColorButton 
        v-for="(beat, index) in beats" 
        :key="index" 
        :beat="beat"
        :style="bounceStyle(index,beat.accent)" 
        class="size-10 rounded-lg bounce bg-bor"
        ref = buttons></ColorButton>
    </div>
  </template>
    
  <script setup lang="ts">
  import { ref, computed} from 'vue';
  import ColorButton from './ColorButton.vue';
  import type { Beat } from '../utils/types';
 
  const props = defineProps<{
    bpms: number[];
    beats: Beat[];
    isRunning: boolean;
    width: number;
  }>();

  const buttons = ref();
  const durations = computed(() => props.bpms.map(bpm => 60*2 / bpm));

  function bounceStyle(index:number, accent:number){
    let color_var;
    switch (accent){
      case 0:
        color_var = 'rgb(97 184 240)'
        break;
      case 1:
        color_var = 'rgb(131 140 241)'
        break;
      case 2:
        color_var = 'rgb(228 121 179)'
        break;
      case 3:
        color_var = 'rgb(156 163 175)'
        break;
    }

    return({
      '--bounce-duration': `${durations.value[index]}s`,
      '--animation-state': props.isRunning? 'running' : 'start',
      '--bounce-width': `${props.width-55}px`,
      '--base-opacity':0.1,
      '--flash-opacity':1,
      '--color-var':color_var
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
      background-color: var(--color-var, oklch(var(--color-var)/var(--flash-opacity)));
    }
    3% {
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    47% {
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    50% {
      transform: translateX(var(--bounce-width));
      background-color: var(--color-var,oklch(var(--color-var)/var(--flash-opacity)));
    }
    53%{
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    97%{
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    100% {
      transform: translateX(0%);
      background-color: var(--color-var,oklch(var(--color-var)/var(--flash-opacity)));
    }
  }
  </style>