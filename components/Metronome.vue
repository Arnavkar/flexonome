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
    <CircularDial :initialBpm="bpm" v-on:update="updateBpm" />
    <button @click="toggleMetronome" class="btn btn-primary btn-outline">{{ isRunning ? 'Stop' : 'Start' }}</button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import CircularDial from './CircularDial.vue';

const props = defineProps({
    initialActiveBar: {
        type: Number,
        default: -1
    }
});
const timeSignature = ref(4);
const bpm = ref(60);
const isRunning = ref(false);
const activeBar = ref(props.initialActiveBar);

let intervalCallbackId: number | undefined = undefined;

function updateBpm(newBpm: number){
  bpm.value = newBpm;
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    stopMetronome();
    startMetronome();
  }
};

function startMetronome(){
  const interval = (60 / bpm.value) * 1000;
  intervalCallbackId = window.setInterval(() => {
    activeBar.value = (activeBar.value + 1) % timeSignature.value;
    // You can add a sound or click here
  }, interval);
  isRunning.value = true;
};

function stopMetronome(){
  if (intervalCallbackId !== undefined) {
    clearInterval(intervalCallbackId);
  }
  isRunning.value = false;
  activeBar.value = -1;
};

function toggleMetronome(){
  if (isRunning.value == true) {
    stopMetronome();
  } else {
    startMetronome();
  }
};

watch(timeSignature, () => {
  //Reset metronome when time signature changes
  if (isRunning.value == true) {
    stopMetronome();
    startMetronome();
  }
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
