<template>
  <div>
    <!-- DESKTOP VIEW -->
    <div v-if="!isMobile" class="flex flex-col h-[100dvh] w-100% items-center justify-center gap-4">
      <MetronomeBars :beats="metronome.beats" :activeBeat="metronome.activeBeat"/>
      <div class="flex flex-wrap items-center justify-center w-full max-w-5xl mx-auto px-4">
          <TimeSignatureInput @timeSignatureChange="(inputStr) => metronome.updateTimeSignature(inputStr)"
            @multipleTimeSignatureSubmit="(inputStr) => metronome.updateTimeSignature(inputStr)" />
        <CircularDial :bpm="metronome.bpm" :acceleratorOptions="metronome.accelerator"
          :progress="metronome.accelerator.progress" @updateBpm="(newBpm) => metronome.updateBpm(newBpm)"
          @toggleAccelerator="() => metronome.toggleAccelerator()" />
        <div class="transition-opacity duration-300" :class="metronome.acceleratorEnabled ? 'opacity-100' : 'opacity-0'">
          <AcceleratorInput
            @acceleratorOptionsSubmit="(options) => metronome.setAccelerator(options)" />
        </div>
      </div>
      <div class="w-full flex justify-center mt-4">
        <button class="btn btn-primary btn-outline w-60" @click="() => metronome.toggle()">
          {{ metronome.isRunning ? 'Stop' : 'Start' }}
        </button>
      </div>
    </div>

    <!-- MOBILE VIEW -->
    <div v-if="isMobile" class="flex flex-col h-[100dvh] w-full items-center justify-center gap-4">
      <MetronomeBars :beats="metronome.beats" :activeBeat="metronome.activeBeat"/>
      <CircularDial :bpm="metronome.bpm" :acceleratorOptions="metronome.accelerator"
        :progress="metronome.accelerator.progress" @updateBpm="(newBpm) => metronome.updateBpm(newBpm)"
        @toggleAccelerator="() => metronome.toggleAccelerator()" />
      <div class="flex justify-around items-center gap-2">
        <ModalCard :modal-id="timeSignatureModalId" @click="showModalById(timeSignatureModalId)">
          <template #buttonui>
            <label class="text-2xl">{{ metronome.numBeats }}</label>
            <div class="divider divider-primary mt-0 mb-0"></div>
            <label class="text-2xl">{{getUniqueBeatUnitValues(metronome.beats.map((beat: Beat) => beat.beatUnit))
              }}</label>
          </template>
          <template #modal>
            <TimeSignatureInput @timeSignatureChange="(inputStr) => metronome.updateTimeSignature(inputStr)"
              @multipleTimeSignatureSubmit="(inputStr) => metronome.updateTimeSignature(inputStr)" />
          </template>
        </ModalCard>
        <button class="btn btn-primary btn-outline w-24 h-24" @click="() => metronome.toggle()">
          {{ metronome.isRunning ? 'Stop' : 'Start' }}
        </button>
        <ModalCard :modal-id="acceleratorModalId" 
          @click="metronome.acceleratorEnabled ? showModalById(acceleratorModalId) : null">
          <template #buttonui>
            <MdiIcon icon="mdiFastForward" :class="IconStyle" />
            <label :class="IconStyle" class="text-xs text-center p-0 m-0"> settings </label>
          </template>
          <template #modal>
            <AcceleratorInput v-if="metronome.acceleratorEnabled"
              @acceleratorOptionsSubmit="(options) => metronome.setAccelerator(options)" />
          </template>
        </ModalCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, provide, inject, computed, onUnmounted } from 'vue';
import MetronomeV2 from '../core/MetronomeV2';
import MetronomeBars from '../components/MetronomeBars.vue';
import CircularDial from '../components/CircularDial.vue';
import TimeSignatureInput from '../components/TimeSignatureInput.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';
import { getUniqueBeatUnitValues, showModalById } from '../utils/utils';
import ModalCard from '../components/ModalCard.vue';
import type { Beat } from '../utils/types'

defineOptions({
  name: 'MetronomePage'
});

//eslint-disable-next-line
const snackbar = useSnackbar();
const timeSignatureModalId = "timeSignatureModal";
const acceleratorModalId = "acceleratorModal";

const isMobile = inject('isMobile');

const metronome = reactive(new MetronomeV2());

const IconStyle = computed(() => {
  return metronome.acceleratorEnabled ? `text-primary` : `opacity-30`;
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
  metronome.beats[index].accent = (metronome.beats[index].accent + 1) % 4;
}

provide('incrementBeatAccent', incrementBeatAccent)

onMounted(() => {
  metronome.addCallbacks(throwSuccess, throwError);

  if (metronome instanceof MetronomeV2) metronome.setup();
});

onUnmounted(() => {
  metronome.clear();
});

</script>