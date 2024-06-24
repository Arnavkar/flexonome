<template>
  <div class="flex flex-col items-center">
    <div>
      <MetronomeBars :numBeats="numBeats" :beatUnit="beatUnit" :activeBar="activeBar"/>
    </div>
    <div class="flex">
      <CircularDial :bpm="bpm" @updateBpm="updateBpm" />
      <TimeSignatureInput
        :bpm="bpm"
        @numBeatsChange="updateNumBeats" 
        @beatUnitChange="updateBeatUnit" 
        @multipleTimeSignatureSubmit="updateMultipleTimeSignature"
      />
    </div>
    <button @click="toggleMetronome" class="btn btn-primary btn-outline mt-4 w-60">{{ isRunning ? 'Stop' : 'Start' }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MetronomeBars from './MetronomeBars.vue';
import CircularDial from './CircularDial.vue';
import TimeSignatureInput from './TimeSignatureInput.vue';

import { parseTimeSignature } from '~/parser';
import type { TimeSignature, Beat } from '~/types';

const numBeats = ref(4);
const beatUnit = ref(4)
const activeBar = ref(-2);
const bpm = ref(120);
const isRunning = ref(false);

let timeoutId: number | null = null;

function restartMetronome(){
  stopMetronome();
  startMetronome();
};

function startMetronome() {
  const interval = (60 / bpm.value) * 1000 / (beatUnit.value / 4);

  function tic() {
    activeBar.value = (activeBar.value + 1) % numBeats.value;
    // You can add a sound or click here
    timeoutId = window.setTimeout(tic, interval);
  }

  if (!isRunning.value) {
    tic();
    isRunning.value = true;
  }
}

function stopMetronome() {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  isRunning.value = false;
  activeBar.value = -2;
}

function toggleMetronome(){
  if (isRunning.value == true) {
    stopMetronome();
  } else {
    startMetronome();
  }
};

function updateBpm(newBpm: number){
  bpm.value = newBpm;
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
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

function updateMultipleTimeSignature(inputString: string){
  console.log(inputString);
    let parsed: any;
    try {
        parsed = parseTimeSignature(inputString,bpm.value);
        console.log(parsed);
    } catch (error) {
        console.error(error.message);
    }
};

watch(numBeats, () => {
  //Reset metronome when time signature changes
  if (isRunning.value == true) {
    restartMetronome();
  }
});
</script>