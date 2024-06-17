<template>
    <div class="flex flex-col items-center">
      <div class="flex space-x-4 mb-4">
        <input type="number" v-model.number="timeSignature" min="1" class="input input-bordered w-24" placeholder="Time Sig">
      </div>
      <div class="flex space-x-4 mb-4">
        <div 
          v-for="(bar, index) in timeSignature" 
          :key="index" 
          class="w-6 h-24 border-2 border-primary rounded" 
          :class="{ 'bg-primary': index === activeBar }">
        </div>
      </div>
      <CircularDial :initialBpm="bpm" @update:bpm="updateBpm" />
      <button @click="toggleMetronome" class="btn btn-primary mt-4">{{ isRunning ? 'Stop' : 'Start' }}</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import CircularDial from './CircularDial.vue';
  
  export default defineComponent({
    name: 'Metronome',
    components: {
      CircularDial,
    },
    props: {
        initialActiveBar: {
            type: Number,
            default: -1
        }
    },
    setup(props) {
      const timeSignature = ref(4);
      const bpm = ref(60);
      const isRunning = ref(false);
      const activeBar = ref(props.initialActiveBar);
      let intervalId: number | undefined = undefined;
  
      const updateBpm = (newBpm: number) => {
        bpm.value = newBpm;
        if (isRunning.value) {
          stopMetronome();
          startMetronome();
        }
      };
  
      const startMetronome = () => {
        const interval = (60 / bpm.value) * 1000;
        intervalId = window.setInterval(() => {
          activeBar.value = (activeBar.value + 1) % timeSignature.value;
          // You can add a sound or click here
        }, interval);
        isRunning.value = true;
      };
  
      const stopMetronome = () => {
        if (intervalId !== undefined) {
          clearInterval(intervalId);
        }
        isRunning.value = false;
        activeBar.value = -1;
      };
  
      const toggleMetronome = () => {
        if (isRunning.value) {
          stopMetronome();
        } else {
          startMetronome();
        }
      };
  
      watch(timeSignature, () => {
        if (isRunning.value) {
          stopMetronome();
          startMetronome();
        }
      });
  
      return {
        timeSignature,
        bpm,
        isRunning,
        activeBar,
        toggleMetronome,
        updateBpm,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  