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
    <Transition>
      <div v-if="errorMsg" role="alert" class="alert alert-error alert-outline mt-10 absolute-bottom">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error! {{errorMsg}}</span>
      </div>
    </Transition>
  </div>
  
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MetronomeBars from './MetronomeBars.vue';
import CircularDial from './CircularDial.vue';
import TimeSignatureInput from './TimeSignatureInput.vue';

import { parseTimeSignature } from '~/parser';
import type { TimeSignature, Beat } from '~/types';

const numBeats:Ref<number> = ref(4);
const beatUnit:Ref<number>  = ref(4)
const activeBar:Ref<number>  = ref(-2);
const bpm:Ref<number>  = ref(120);
const isRunning:Ref<boolean>  = ref(false);
const errorMsg: Ref<string|null> = ref(null);

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
  } catch (error: any) {
    console.log(error.message);
    errorMsg.value = error.message;
    setTimeout(() => {
      errorMsg.value = null;
    }, 2000);
  }
};

watch(numBeats, () => {
  //Reset metronome when time signature changes
  if (isRunning.value == true) {
    restartMetronome();
  }
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>