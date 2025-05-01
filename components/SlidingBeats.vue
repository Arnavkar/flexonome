<template>
    <div class="flex flex-col gap-4">
        <ColorButton 
        v-for="(beat, index) in beats" 
        :key="index" 
        :beat="beat"
        :buttonStyle="bounceStyle(index,beat.accent)" 
        :buttonClass="'size-12 rounded-lg bounce bg-border-primary'"
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

    return `
      --bounce-duration: ${durations.value[index]}s;
      --animation-state: ${props.isRunning ? 'running' : 'start'};
      --full-width: ${props.width - 55}px;
      --mid-width: ${(props.width - 55) / 2}px;
      --base-opacity: 0.1;
      --flash-opacity: 1;
      --color-var: ${color_var};
    `;
  }

  </script>
  
  <style>
  .bounce {
    animation: left-right var(--bounce-duration) var(--animation-state) infinite;
    animation-timing-function: linear;
  }

  @keyframes left-right {
    0% {
      -webkit-transform: translateX(0%) translateY(0%) scale(100%);
      background-color: var(--color-var, oklch(var(--color-var)/var(--flash-opacity)));
    }
    3% {
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    25%{
      -webkit-transform: translateX(var(--mid-width)) translateY(5px) scale(125%);
    }
    47% {
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    50% {
      -webkit-transform: translateX(var(--full-width)) translateY(0%) scale(100%);
      background-color: var(--color-var,oklch(var(--color-var)/var(--flash-opacity)));
    }
    53%{
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    75%{
      -webkit-transform: translateX(var(--mid-width)) translateY(-10px) scale(60%);
    }
    97%{
      background-color: var(--fallback-p,oklch(var(--p)/var(--base-opacity)))
    }
    100% {
      -webkit-transform: translateX(0%) translateY(0%) scale(100%);
      background-color: var(--color-var,oklch(var(--color-var)/var(--flash-opacity)));
    }
  }
  </style>