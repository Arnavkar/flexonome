<template>

  <div>
    <!-- DESKTOP VIEW -->
    <div v-if="!isMobile" class="flex flex-col items-center justify-between">
      <MetronomeBars :beats="metronome.beats" :activeBar="metronome.activeBar" />
      <div class="grid grid-cols-3 mt-0">
        <div class="flex flex-col items-end justify-center">
          <TimeSignatureInput @timeSignatureChange="(inputStr) => metronome.updateTimeSignature(inputStr)"
            @multipleTimeSignatureSubmit="(inputStr) => metronome.updateTimeSignature(inputStr)" />
        </div>
        <CircularDial :bpm="metronome.bpm" :acceleratorOptions="metronome.accelerator"
          :progress="metronome.accelerator.progress" @updateBpm="(newBpm) => metronome.updateBpm(newBpm)"
          @toggleAccelerator="() => metronome.toggleAccelerator()" />
        <SlideTransition>
          <AcceleratorInput v-if="metronome.acceleratorEnabled"
            @acceleratorOptionsSubmit="(options) => metronome.setAccelerator(options)" />
        </SlideTransition>
      </div>
      <button class="btn btn-primary btn-outline mt-4 w-60" @click="() => metronome.toggle()">
        {{ metronome.isRunning ? 'Stop' : 'Start' }}
      </button>
    </div>

    <!-- MOBILE VIEW -->
    <div v-if="isMobile" class="flex flex-col items-center justify-between w-96 mt-10">
      <MetronomeBars :beats="metronome.beats" :activeBar="metronome.activeBar" />
      <CircularDial :bpm="metronome.bpm" :acceleratorOptions="metronome.accelerator"
        :progress="metronome.accelerator.progress" @updateBpm="(newBpm) => metronome.updateBpm(newBpm)"
        @toggleAccelerator="() => metronome.toggleAccelerator()" />
      <div class="flex justify-around items-center">
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
import { onMounted, reactive, provide, computed } from 'vue';
import MetronomeV2 from '../core/MetronomeV2';
import MetronomeBars from '../components/MetronomeBars.vue';
import CircularDial from '../components/CircularDial.vue';
import TimeSignatureInput from '../components/TimeSignatureInput.vue';
import SlideTransition from '../components/SlideTransition.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';
import { getUniqueBeatUnitValues, showModalById } from '../utils/utils';
import ModalCard from '../components/ModalCard.vue';
import type { Beat } from '../utils/types'
import { useDevice } from '../composables/useDevice';

defineOptions({
  name: 'MetronomePage'
});

//eslint-disable-next-line
const snackbar = useSnackbar();
const timeSignatureModalId = "timeSignatureModal";
const acceleratorModalId = "acceleratorModal";

const { isMobile } = useDevice();

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

</script>