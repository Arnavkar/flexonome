<template>
  <div class="flex flex-col items-center justify-between">
    <SlideTransition>
        <MetronomeBars :numBeats="numBeats" :beatUnit="beatUnit" :activeBar="activeBar" :key="numBeats"/>
    </SlideTransition>
    <div class="grid grid-cols-3 mt-8">
      <div class="flex flex-col items-end justify-center">
        <TimeSignatureInput
            :bpm="bpm"
            @numBeatsChange="updateNumBeats" 
            @beatUnitChange="updateBeatUnit" 
            @multipleTimeSignatureSubmit="updateMultipleTimeSignature"
          />
      </div>
      <CircularDial 
        :bpm="bpm"
        :acceleratorOptions="acceleratorOptions" 
        :progress="progress"
        @updateBpm="updateBpm" 
        @showAcceleratorOptions="showAcceleratorOptions"/>
      <SlideTransition>
        <AcceleratorInput 
          v-if="showAccelerator" 
          @acceleratorOptionsSubmit="setAcceleratorOptions"/>
      </SlideTransition>
    </div>
    <button @click="toggleMetronome" class="btn btn-primary btn-outline mt-4 w-60">{{ isRunning ? 'Stop' : 'Start' }}</button>
    <Transition>
    <div v-if="errorMsg" role="alert" class="alert alert-error alert-outline mt-10 absolute-bottom w-1/2">
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
import { ref } from 'vue';
import MetronomeBars from './MetronomeBars.vue';
import CircularDial from './CircularDial.vue';
import TimeSignatureInput from './TimeSignatureInput.vue';
import SlideTransition from './SlideTransition.vue';

import { parseTimeSignature, updateTimeSignatureBPM } from '~/parser';
import type { Accelerator, TimeSignature } from '~/types';
import AcceleratorInput from './AcceleratorInput.vue';

const numBeats:Ref<number> = ref(4);
const beatUnit:Ref<number[]>  = ref(Array(numBeats.value).fill(4));
const bpm:Ref<number>  = ref(120);
const isRunning:Ref<boolean>  = ref(false);

const timeSignature: Ref<TimeSignature> = ref(parseTimeSignature(`${numBeats.value}/${beatUnit.value[0]}`, bpm.value));

const activeBar:Ref<number>  = ref(-2);

const showAccelerator:Ref<boolean>  = ref(false);

const acceleratorOptions:Ref<Accelerator> = ref({
  numBarsToRepeat:4,
  bpmIncrement:5,
  startBPM:120,
  maxBpm:180
});

const progress:Ref<number> = ref(0);

const errorMsg: Ref<string|null> = ref(null);

let timeoutId: number | null = null;

function restartMetronome(){
  stopMetronome();
  startMetronome();
};

function startMetronome() {
    const beats = timeSignature.value.beats;
    let currentBeatIndex = 0;
    let currentBeatInAcceleratorLoop = 0;
    let numBeatsBeforeIncrement = 0

    if(showAccelerator.value){
      currentBeatInAcceleratorLoop = 0
      numBeatsBeforeIncrement = beats.length * acceleratorOptions.value.numBarsToRepeat + 1;
    }

    function tic() {
      const currentBeat = beats[currentBeatIndex];
      activeBar.value = currentBeat.beatIndex;
      // You can add a sound or click here
      currentBeatIndex = (currentBeatIndex + 1) % beats.length;

      timeoutId = window.setTimeout(tic, currentBeat.interval? currentBeat.interval : 1000);

      if (showAccelerator.value){
        currentBeatInAcceleratorLoop = (currentBeatInAcceleratorLoop + 1) % numBeatsBeforeIncrement;
        progress.value = Math.floor((currentBeatInAcceleratorLoop / (numBeatsBeforeIncrement-1))*100)
        if (currentBeatInAcceleratorLoop == 0){
          updateBpm(Math.min(acceleratorOptions.value.maxBpm, bpm.value + acceleratorOptions.value.bpmIncrement));
        }
      } 
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

function validateBPM(bpm_value:number){
    if (bpm.value < 20 || bpm.value > 300) {
      throwError("BPM must be between 20 and 300");
      return false;
    }
    return true;
};

function toggleMetronome(){
  if (!validateBPM(bpm.value)) return;
  if (isRunning.value == true) {
    stopMetronome();
  } else {
    startMetronome();
  }
};

function updateBpm(newBpm: number){
  bpm.value = newBpm;
  timeSignature.value = updateTimeSignatureBPM(bpm.value, timeSignature.value);
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function updateNumBeats(newNumBeats: number){
  numBeats.value = newNumBeats;
  beatUnit.value = Array(numBeats.value).fill(beatUnit.value[0]);
  timeSignature.value = parseTimeSignature(`${numBeats.value}/${beatUnit.value[0]}`, bpm.value);
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function updateBeatUnit(newBeatUnit: number){
  beatUnit.value = Array(numBeats.value).fill(newBeatUnit);
  timeSignature.value = parseTimeSignature(`${numBeats.value}/${beatUnit.value[0]}`, bpm.value);
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function updateMultipleTimeSignature(inputString: string){
  //console.log(inputString);
  try {
      let parsed = parseTimeSignature(inputString,bpm.value);
      timeSignature.value = parsed;
      beatUnit.value = parsed.beats.map(beat => beat.beatUnit)
      numBeats.value = parsed.numBeats;
  } catch (error: any) {
    throwError(error.message);
  }
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function throwError(message: string){
  errorMsg.value = message;
  setTimeout(() => {
    errorMsg.value = null;
  }, 2000);
}

function validateAccelerator(accelerator:Accelerator){
    if (accelerator.startBPM < 20 || accelerator.startBPM > 280){
      throwError("Starting BPM must be between 20 and 280");
      return false;
    }
    if (accelerator.maxBpm < 40 || accelerator.maxBpm > 300){
      throwError("Max BPM must be between 40 and 300");
      return false;
    }
    if (accelerator.startBPM > accelerator.maxBpm){
      throwError("Starting BPM must be less than Max BPM");
      return false;
    }
    return true;
}

function setAcceleratorOptions(accelerator:Accelerator){
  if(!validateAccelerator(accelerator)) return;
  stopMetronome();
  acceleratorOptions.value = accelerator;
  updateBpm(accelerator.startBPM);
}

function showAcceleratorOptions(showAcceleratorBool: boolean){
  showAccelerator.value = showAcceleratorBool;
  stopMetronome();
}
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