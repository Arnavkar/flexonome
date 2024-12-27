<template>
  <div>
  <Transition name="fade-slide">
    <div v-if="renderPage" class="flex flex-col items-center justify-between">
      <MetronomeBars 
        :numBeats="metronome.numBeats" 
        :beatUnit="metronome.beatUnit" 
        :activeBar="metronome.activeBar" 
        :accents="metronome.accents"/>

      <div v-if="!isMobileDevice" class="grid grid-cols-3 mt-8">
        <div class="flex flex-col items-end justify-center">
          <TimeSignatureInput 
            @timeSignatureChange="(inputStr) => metronome.updateTimeSignature(inputStr)"
            @multipleTimeSignatureSubmit="(inputStr) => metronome.updateTimeSignature(inputStr)"/>
        </div>
        <CircularDial 
          :bpm="metronome.bpm" 
          :acceleratorOptions="metronome.acceleratorOptions" 
          :progress="metronome.accelerator.progress" 
          @updateBpm="(newBpm) => metronome.updateBpm(newBpm)"
          @toggleAccelerator="() => metronome.toggleAccelerator()" />
        <SlideTransition>
          <AcceleratorInput 
            v-if="metronome.acceleratorEnabled" 
            @acceleratorOptionsSubmit="(options) => metronome.setAcceleratorOptions(options)"/>
        </SlideTransition>
      </div>

      <button class="btn btn-primary btn-outline mt-4 w-60"
        v-if="!isMobileDevice" 
        @click="() => {
          metronome.toggle();
        }">
        {{ metronome.isRunning ? 'Stop' : 'Start'}}
      </button>

      <div v-if="isMobileDevice" class="flex flex-col w-auto gap-4">
        <CircularDial 
          :bpm="metronome.bpm" 
          :acceleratorOptions="metronome.acceleratorOptions" 
          :progress="metronome.accelerator.progress" 
          @updateBpm="(newBpm) => metronome.updateBpm(newBpm)"
          @toggleAccelerator="() => metronome.toggleAccelerator()"/>
        <div class="flex justify-around items-center">
          <BaseCard :size="24">{{ metronome.numBeats }}/{{ metronome.beatUnit[0]}}</BaseCard>
          <button class="btn btn-primary btn-outline w-24 h-24"
            @click="() => metronome.toggle()">
            {{ metronome.isRunning ? 'Stop' : 'Start'}}
          </button>
          <BaseCard :size="24">{{ metronome.numBeats }}/{{ metronome.beatUnit[0]}}</BaseCard>
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
import { ref, onMounted, reactive} from 'vue';
import type { Ref } from 'vue';
//import Metronome from '../core/Metronome';
import MetronomeV2 from '../core/MetronomeV2';
import MetronomeBars from '../components/MetronomeBars.vue';
import CircularDial from '../components/CircularDial.vue';
import TimeSignatureInput from '../components/TimeSignatureInput.vue';
import SlideTransition from '../components/SlideTransition.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';

import { isMobile } from '../utils/utils';

const renderPage: Ref<boolean> = ref(false);
const isMobileDevice: Ref<boolean | null> = ref(null);

const metronome = reactive(new MetronomeV2());

const errorMsg: Ref<string | null> = ref(null);
const successMsg: Ref<string | null> = ref(null);

// function throwError(message: string) {
//   errorMsg.value = message;
//   setTimeout(() => {
//     errorMsg.value = null;
//   }, 2000);
// }

// function throwSuccess(message: string) {
//   successMsg.value = message;
//   setTimeout(() => {
//     successMsg.value = null;
//   }, 2000);
// }

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 200);
}

onMounted(() => {
    showPage();
    isMobileDevice.value = isMobile();
    //metronome.addCallbacks(throwSuccess, throwError);
    //metronome.setAccents()

    metronome.setup();
  });

</script>