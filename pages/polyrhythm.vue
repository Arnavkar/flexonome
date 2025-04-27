<template>
  <div>
    <!-- DESKTOP VIEW -->
    <div v-if="!isMobile" class="flex flex-col h-[100dvh] w-full items-center justify-center gap-4">
      <div class="grid grid-cols-[3fr_4fr_3fr] mt-8">
        <div class="flex flex-col items-end justify-center">
          <RatioInput @ratio1Change="(newVal: number) => polyrhythm.updateRatio(0, newVal)"
            @ratio2Change="(newVal: number) => polyrhythm.updateRatio(1, newVal)" />
          <CircularDial :bpm="polyrhythm.bpm" :acceleratorOptions="polyrhythm.accelerator"
            :progress="polyrhythm.accelerator.progress" @updateBpm="(newBpm: number) => polyrhythm.updateBpm(newBpm)"
            @toggleAccelerator="() => polyrhythm.toggleAccelerator()" />
        </div>
        <PolyrhythmCircles :beats_1="polyrhythm.beats_1" :beats_2="polyrhythm.beats_2"
          :activeCircles_1="polyrhythm.activeCircles[0]" :activeCircles_2="polyrhythm.activeCircles[1]"
          :isMobile="false" />
        <div class="flex flex-col items-start justify-center">
          <SlideTransition>
            <AcceleratorInput v-if="polyrhythm.acceleratorEnabled"
              @acceleratorOptionsSubmit="(options: Accelerator) => polyrhythm.setAccelerator(options)" />
          </SlideTransition>
        </div>
      </div>
      <button @click="() => polyrhythm.toggle()" class="btn btn-primary btn-outline mt-4 w-60">{{ polyrhythm.isRunning ?
        'Stop' : 'Start'}}</button>
    </div>

    <!-- MOBILE VIEW -->
    <div v-if="isMobile" class="flex flex-col h-[100dvh] w-full items-center justify-center">
      <PolyrhythmCircles :beats_1="polyrhythm.beats_1" :beats_2="polyrhythm.beats_2"
        :activeCircles_1="polyrhythm.activeCircles[0]" :activeCircles_2="polyrhythm.activeCircles[1]"
        :isMobile="true" />
      <CircularDial :bpm="polyrhythm.bpm" :acceleratorOptions="polyrhythm.accelerator"
        :progress="polyrhythm.accelerator.progress" @updateBpm="(newBpm: number) => polyrhythm.updateBpm(newBpm)"
        @toggleAccelerator="() => polyrhythm.toggleAccelerator()" />
      <div class="flex justify-around items-center">
        <RatioInput :isMobile="true" @ratio1Change="(newVal: number) => polyrhythm.updateRatio(0, newVal)"
          @ratio2Change="(newVal: number) => polyrhythm.updateRatio(1, newVal)" />
        <button class="btn btn-primary btn-outline w-24 h-24" @click="() => polyrhythm.toggle()">
          {{ polyrhythm.isRunning ? 'Stop' : 'Start' }}
        </button>
        <ModalCard :modal-id="acceleratorModalId"
          @click="polyrhythm.acceleratorEnabled ? showModalById(acceleratorModalId) : null">
          <template #buttonui>
            <label :class="IconStyle" class="text-xs text-center p-0 m-0"> settings </label>
          </template>
          <template #modal>
            <AcceleratorInput v-if="polyrhythm.acceleratorEnabled"
              @acceleratorOptionsSubmit="(options: Accelerator) => polyrhythm.setAccelerator(options)" />
          </template>
        </ModalCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, provide, computed, inject, onUnmounted } from 'vue';
import type { Accelerator } from '../utils/types';
import CircularDial from '../components/CircularDial.vue';
import SlideTransition from '../components/SlideTransition.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';
import PolyRhythmV2 from '../core/PolyRhythmV2';
import PolyrhythmCircles from '~/components/PolyrhythmCircles.vue';
import { showModalById } from '../utils/utils';

defineOptions({
  name: 'PolyrhythmPage'
});

//eslint-disable-next-line
definePageMeta({
  middleware: ['auth']
});

//eslint-disable-next-line
const snackbar = useSnackbar();
const polyrhythm = reactive(new PolyRhythmV2());
const isMobile = inject('isMobile');
const acceleratorModalId = "acceleratorModal";

const IconStyle = computed(() => {
  return polyrhythm.acceleratorEnabled ? `text-primary` : `opacity-30`;
})

function throwError(message: string) {
  if (!snackbar) return;
  snackbar.add({
    type: 'error',
    text: message
  })
}

function throwSuccess(message: string) {
  snackbar.add({
    type: 'success',
    text: message
  })
}

function incrementBeatAccent(index: number) {
  polyrhythm.beats[index].accent = (polyrhythm.beats[index].accent + 1) % 4;
}

provide('incrementBeatAccent', incrementBeatAccent)

onMounted(() => {
  polyrhythm.addCallbacks(throwSuccess, throwError);

  if (polyrhythm instanceof PolyRhythmV2) polyrhythm.setup();
});

onUnmounted(() => {
  polyrhythm.clear();
});

</script>