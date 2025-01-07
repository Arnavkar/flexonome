<template>
    <div class="flex flex-col gap-4">
        <ColorButton 
        v-for="(beat, index) in beats" 
        :key="index" 
        :beat="beat"
        :style="bounceStyle(index)" 
        class="size-10 rounded-lg bounce"
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
  // Compute the duration in seconds based on the BPM
  const durations = computed(() => props.bpms.map(bpm => 60*2 / bpm));
  // Create a style object for the bounce animation

  function bounceStyle(index:number){
    return({
      '--bounce-duration': `${durations.value[index]}s`,
      '--animation-state': props.isRunning? 'running' : 'start',
      '--bounce-width': `${props.width-55}px`
    });
  };

  // watch(() => props.isRunning, () => {
  //   if (props.isRunning) {
  //     buttons.value.forEach((button: typeof ColorButton, index:number) => {
  //       intervals.value.push(window.setInterval(() => {
  //         button.tic();
  //       }, durations.value[index]*1000/2));
  //     });
  //   } else {
  //     intervals.value.forEach(interval => {
  //       window.clearInterval(interval);
  //     });
  //   }
  // });


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
      transform: translateX(var(--bounce-width));
    }
    100% {
      transform: translateX(0%);
    }
  }
  </style>