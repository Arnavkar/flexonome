<template>
  <div>
  <Transition name="fade-slide">
    <div v-if="renderPage" class="flex flex-col items-center justify-between">
        <MetronomeBars :numBeats="numBeats" :beatUnit="beatUnit" :activeBar="activeBar" :accents="accents"/>
      <div v-if="!isMobileDevice" class="grid grid-cols-3 mt-8">
        <div class="flex flex-col items-end justify-center">
          <TimeSignatureInput @numBeatsChange="updateNumBeats" @beatUnitChange="updateBeatUnit"
            @multipleTimeSignatureSubmit="updateMultipleTimeSignature" />
        </div>
        <CircularDial :bpm="bpm" :acceleratorOptions="acceleratorOptions" :progress="progress" @updateBpm="updateBpm"
          @showAcceleratorOptions="showAcceleratorOptions" />
        <SlideTransition>
          <AcceleratorInput v-if="showAccelerator" @acceleratorOptionsSubmit="setAcceleratorOptions" />
        </SlideTransition>
      </div>
      <button v-if="!isMobileDevice" @click="toggleMetronome" class="btn btn-primary btn-outline mt-4 w-60">
        {{ isRunning ? 'Stop' : 'Start'}}
      </button>

      <div v-if="isMobileDevice" class="flex flex-col w-auto">
        <CircularDial :bpm="bpm" :acceleratorOptions="acceleratorOptions" :progress="progress" @updateBpm="updateBpm"
          @showAcceleratorOptions="showAcceleratorOptions" />
        <div class="flex justify-around items-center">
          <Card :size="20">{{ numBeats }}/{{ beatUnit[0]}}</Card>
          <button @click="toggleMetronome" class="btn btn-primary btn-outline w-32">
            {{ isRunning ? 'Stop' : 'Start'}}
          </button>
          
        </div>
      </div>
      
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
import MetronomeBars from '../components/MetronomeBars.vue';
import CircularDial from '../components/CircularDial.vue';
import TimeSignatureInput from '../components/TimeSignatureInput.vue';
import SlideTransition from '../components/SlideTransition.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';

import { parseTimeSignature, validateBPM, validateAccelerator } from '~/utils/utils';
import type { Accelerator, TimeSignature } from '../utils/types';
import { defaultAccelerator } from '~/constants';

import { isMobile } from '../utils/utils';

const renderPage: Ref<boolean> = ref(false);
const isMobileDevice: Ref<boolean | null> = ref(null);

const bpm: Ref<number> = ref(120);
const isRunning: Ref<boolean> = ref(false);

const numBeats: Ref<number> = ref(4);
const beatUnit: Ref<number[]> = ref(Array(numBeats.value).fill(4));
const timeSignature: Ref<TimeSignature> = ref(parseTimeSignature(`${numBeats.value}/${beatUnit.value[0]}`, bpm.value));
const accents : Ref<number[]> = ref([1,0,0,0]);
const activeBar: Ref<number> = ref(-2);

const showAccelerator: Ref<boolean> = ref(false);
const acceleratorOptions: Ref<Accelerator> = ref(defaultAccelerator);
const progress: Ref<number> = ref(0);

const errorMsg: Ref<string | null> = ref(null);
const successMsg: Ref<string | null> = ref(null);
const drift:Ref<number> = ref(0);

let timeoutId: number | null = null;

function restartMetronome() {
  stopMetronome();
  startMetronome();
};

function startMetronome() {
  const beats = timeSignature.value.beats;
  let currentBeatIndex = 0;
  let currentBeatInAcceleratorLoop = 0;
  let numBeatsBeforeIncrement = 0;
  const start = Date.now()
  let totalTime = 0;

  if (showAccelerator.value) {
    numBeatsBeforeIncrement = beats.length * acceleratorOptions.value.numBarsToRepeat + 1;
  }

  const tic = () => {
    const currentBeat = beats[currentBeatIndex];
    const timeDrift = Math.max((new Date().getTime() - start) - totalTime,0);
    drift.value = timeDrift;

    activeBar.value = currentBeat.beatIndex;
    // You can add a sound or click here
    currentBeatIndex = (currentBeatIndex + 1) % beats.length;

    timeoutId = window.setTimeout(tic, currentBeat.interval ? currentBeat.interval - timeDrift : 1000);
    totalTime += currentBeat.interval;

    if (showAccelerator.value) {
      currentBeatInAcceleratorLoop = (currentBeatInAcceleratorLoop + 1) % numBeatsBeforeIncrement;
      progress.value = Math.floor((currentBeatInAcceleratorLoop / (numBeatsBeforeIncrement - 1)) * 100)
      if (currentBeatInAcceleratorLoop == 0) {
        updateBpm(Math.min(acceleratorOptions.value.maxBpm, bpm.value + acceleratorOptions.value.bpmIncrement));
      }
    }
  }

  if (!isRunning.value) {
    tic()
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
  timeSignature.value = updateTimeSignatureBPM(bpm.value, timeSignature.value);
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function updateNumBeats(newNumBeats: number) {
  numBeats.value = newNumBeats;
  beatUnit.value = Array(numBeats.value).fill(beatUnit.value[0]);
  timeSignature.value = parseTimeSignature(`${numBeats.value}/${beatUnit.value[0]}`, bpm.value);
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function updateBeatUnit(newBeatUnit: number) {
  beatUnit.value = Array(numBeats.value).fill(newBeatUnit);
  timeSignature.value = parseTimeSignature(`${numBeats.value}/${beatUnit.value[0]}`, bpm.value);
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function updateMultipleTimeSignature(inputString: string) {
  try {
    let parsed = parseTimeSignature(inputString, bpm.value);
    timeSignature.value = parsed;
    beatUnit.value = parsed.beats.map((beat: Beat) => beat.beatUnit)
    numBeats.value = parsed.numBeats;
    accents.value = getAccents(timeSignature.value);
    throwSuccess('Multple Time signature created');
  } catch (error: any) {
    throwError(error.message);
  }
  
  if (isRunning.value == true) {
    // Restart the metronome with the new BPM
    restartMetronome();
  }
};

function getAccents(timeSignature:TimeSignature){
  const accentArr = timeSignature.beats.map((beat:Beat) => beat.isFirst? 1:0);
  return accentArr;
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

function updateTimeSignatureBPM(newBpm: number, timeSignature: TimeSignature): TimeSignature {
  timeSignature.beats.forEach(beat => {
    beat.interval = (60 / newBpm) * 1000 / (beat.beatUnit / 4);
  });
  return timeSignature;
}

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 500);
}

onMounted(() => {
    showPage();
    isMobileDevice.value = isMobile();
    accents.value = getAccents(timeSignature.value);
});

</script>