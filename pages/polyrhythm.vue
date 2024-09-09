<template>
  <div>
  <Transition name="fade-slide">
    <div v-if="renderPage" class="flex flex-col items-center justify-between">
      <div class="grid grid-cols-3 mt-8">
        <div class="flex flex-col items-end justify-center">
          <RatioInput @ratio1Change="updateRatio1Value" @ratio2Change="updateRatio2Value" />
          <CircularDial :bpm="bpm" :acceleratorOptions="acceleratorOptions" :progress="progress" @updateBpm="updateBpm"
            @showAcceleratorOptions="showAcceleratorOptions" />
        </div>
        <PolyrhythmDial :x="ratio_1" :y="ratio_2" :size="350" :activeCircles_1="activeCircles[0]" :activeCircles_2="activeCircles[1]"/>
        <div class="flex flex-col items-start justify-center">
          <SlideTransition>
            <AcceleratorInput v-if="showAccelerator" @acceleratorOptionsSubmit="setAcceleratorOptions" />
          </SlideTransition>
        </div>
      </div>
      <button @click="toggleMetronome" class="btn btn-primary btn-outline mt-4 w-60">{{ isRunning ? 'Stop' : 'Start'
        }}</button>
      <Transition name="fade-slide">
        <div v-if="errorMsg" role="alert" class="alert alert-error alert-outline mt-10 absolute-bottom w-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error! {{ errorMsg }}</span>
        </div>
      </Transition>
      <Transition name="fade-slide">
        <div v-if="successMsg" role="alert" class="alert alert-success alert-outline mt-10 absolute-bottom w-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
          <span>Success! {{ successMsg }}</span>
        </div>
      </Transition>
    </div>
  </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CircularDial from '../components/CircularDial.vue';
import SlideTransition from '../components/SlideTransition.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';

import {validateBPM, validateAccelerator, constructPolyrhythm} from '~/utils/utils';
import type { Accelerator, Polyrhythm } from '../utils/types';
import { defaultAccelerator } from '~/constants';
import PolyrhythmDial from '~/components/PolyrhythmDial.vue';

const renderPage: Ref<boolean> = ref(false);

const bpm: Ref<number> = ref(120);
const isRunning: Ref<boolean> = ref(false);

const ratio_1: Ref<number> = ref(3);
const ratio_2: Ref<number> = ref(4);
const polyrhythm: Ref<Polyrhythm> = ref(constructPolyrhythm(ratio_1.value, ratio_2.value, bpm.value));

const showAccelerator: Ref<boolean> = ref(false);
const acceleratorOptions: Ref<Accelerator> = ref(defaultAccelerator);
const progress: Ref<number> = ref(0);

const errorMsg: Ref<string | null> = ref(null);
const successMsg: Ref<string | null> = ref(null);
const drift:Ref<number[]> = ref([0,0]);

const activeCircles: Ref<number[]> = ref([-2, -2]);
let timeoutIds: number[] = [-1,-1]

function restartMetronome() {
  stopMetronome();
  startMetronome();
};

function startMetronome() {
  let currentBeatIndexes = [0,0];
  let currentBeatInAcceleratorLoop = 0;
  let numBeatsBeforeIncrement = polyrhythm.value.ratios[0] * acceleratorOptions.value.numBarsToRepeat + 1;
  const start = Date.now()
  let totalTimes = [0,0];

  const tic = (index: number) => {
    activeCircles.value[index] = currentBeatIndexes[index]
    currentBeatIndexes[index] = (currentBeatIndexes[index] + 1) % polyrhythm.value.ratios[index]
    const timeDrift = Math.max((new Date().getTime() - start) - totalTimes[index],0);
    drift.value[index] = timeDrift;

    timeoutIds[index] = window.setTimeout(tic, polyrhythm.value.intervals[index] - timeDrift,index)
    totalTimes[index] += polyrhythm.value.intervals[index];
    
    if(showAccelerator.value && index == 0){
      currentBeatInAcceleratorLoop = (currentBeatInAcceleratorLoop + 1) % numBeatsBeforeIncrement;
      progress.value = Math.floor((currentBeatInAcceleratorLoop / (numBeatsBeforeIncrement-1)) * 100)
      if (currentBeatInAcceleratorLoop == 0) {
        updateBpm(Math.min(acceleratorOptions.value.maxBpm, bpm.value + acceleratorOptions.value.bpmIncrement))
      }
    }
  }

  if (!isRunning.value) {
    tic(0);
    tic(1);
    isRunning.value = true;
  }
}

function stopMetronome() {
  timeoutIds.forEach((id) => {
    if (id !== null) clearTimeout(id);
  });
  timeoutIds = [-1,-1]
  isRunning.value = false;
  activeCircles.value = [-2, -2];
  progress.value = 0
}

function toggleMetronome() {
  if (!validateBPM(bpm.value, throwError)) return;
  if (isRunning.value == true) {
    stopMetronome();
  } else {
    startMetronome();
  }
};

function throwError(message: string) {
  errorMsg.value = message;
  setTimeout(() => {
    errorMsg.value = null;
  }, 2000);
}

function throwSuccess(message: string) {
  successMsg.value = message;
  setTimeout(() => {
    successMsg.value = null;
  }, 2000);
}

function updateBpm(newBpm: number) {
  if (!validateBPM(newBpm, throwError)) return;
  bpm.value = newBpm;
  polyrhythm.value = constructPolyrhythm(ratio_1.value, ratio_2.value, bpm.value);
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
}

function setAcceleratorOptions(accelerator: Accelerator) {
  if (!validateAccelerator(accelerator, throwError)) return;
  stopMetronome();
  acceleratorOptions.value = accelerator;
  updateBpm(accelerator.startBPM);
  throwSuccess('New Accelerator created');
}

function showAcceleratorOptions(showAcceleratorBool: boolean) {
  showAccelerator.value = showAcceleratorBool;
  stopMetronome();
}

function updateRatio1Value(value: number) {
  ratio_1.value = value;
  polyrhythm.value = constructPolyrhythm(ratio_1.value, ratio_2.value, bpm.value);
}

function updateRatio2Value(value: number) {
  ratio_2.value = value;
  polyrhythm.value = constructPolyrhythm(ratio_1.value, ratio_2.value, bpm.value);
}

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 500);
}

onMounted(() => {
    showPage();
});

</script>