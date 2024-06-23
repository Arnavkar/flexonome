<template>
  <div class="flex flex-col items-center">
    <div>
      <MetronomeBars :numBeats="numBeats" :beatUnit="beatUnit" :activeBar="activeBar"/>
    </div>
    <div class="flex">
      <CircularDial :initialBpm="bpm" v-on:update="updateBpm" />
      <TimeSignatureInput
        @numBeatsChange="updateNumBeats" 
        @beatUnitChange="updateBeatUnit" 
      />
    </div>
    <button @click="toggleMetronome" class="btn btn-primary btn-outline mt-4">{{ isRunning ? 'Stop' : 'Start' }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CircularDial from './CircularDial.vue';
import TimeSignatureInput from './TimeSignatureInput.vue';

const props = defineProps({
    initialActiveBar: {
        type: Number,
        default: -1
    },
    initialNumBeats: {
        type: Number,
        default: 4
    },
    initialBeatUnit: {
        type: Number,
        default: 4
    }
});
const numBeats = ref(props.initialNumBeats);
const beatUnit = ref(props.initialBeatUnit)
const activeBar = ref(props.initialActiveBar);
const bpm = ref(120);
const isRunning = ref(false);

let intervalCallbackId: number | undefined = undefined;

function updateBpm(newBpm: number){
  bpm.value = newBpm;
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function startMetronome(){
  const interval = (60 / bpm.value) * 1000 / (beatUnit.value / 4)
  intervalCallbackId = window.setInterval(() => {
    activeBar.value = (activeBar.value + 1) % numBeats.value;
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

function updateNumBeats(newNumBeats: number){
  numBeats.value = newNumBeats;
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function updateBeatUnit(newBeatUnit: number){
  beatUnit.value = newBeatUnit;
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function restartMetronome(){
  stopMetronome();
  startMetronome();
};

watch(numBeats, () => {
  //Reset metronome when time signature changes
  if (isRunning.value == true) {
    restartMetronome();
  }
});
</script>