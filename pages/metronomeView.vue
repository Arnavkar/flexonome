<template>
  <div>
    <Transition name="fade-slide">
      <div v-if="renderPage" class="flex flex-col items-center justify-between">
        <MetronomeBars :numBeats="metronome.numBeats" :beatUnit="metronome.beatUnit" :activeBar="metronome.activeBar"
          :accents="metronome.accents" />
        <div v-if="!isMobileDevice" class="grid grid-cols-3 mt-8">
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

        <button class="btn btn-primary btn-outline mt-4 w-60" v-if="!isMobileDevice" @click="() => {
          metronome.toggle();
        }">
          {{ metronome.isRunning ? 'Stop' : 'Start' }}
        </button>

        <div v-if="isMobileDevice" class="flex-col w-auto gap-4">
          <CircularDial :bpm="metronome.bpm" :acceleratorOptions="metronome.accelerator"
            :progress="metronome.accelerator.progress" @updateBpm="(newBpm) => metronome.updateBpm(newBpm)"
            @toggleAccelerator="() => metronome.toggleAccelerator()" />
          <div class="flex justify-around items-center">
            <ModalCard 
              :size="24" 
              :text="`${metronome.numBeats}/${metronome.beatUnit[0]}`"
              :modal-id="timeSignatureModalId" 
              @click="showTimeSignatureModal">
              <div class="flex flex-col items-end justify-center">
                <TimeSignatureInput @timeSignatureChange="(inputStr) => metronome.updateTimeSignature(inputStr)"
                @multipleTimeSignatureSubmit="(inputStr) => metronome.updateTimeSignature(inputStr)" />
              </div>
            </ModalCard>
            <button class="btn btn-primary btn-outline w-24 h-24" @click="() => metronome.toggle()">
              {{ metronome.isRunning ? 'Stop' : 'Start' }}
            </button>
            <BaseCard :size="24">{{ metronome.numBeats }}/{{ metronome.beatUnit[0] }}</BaseCard>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import type { Ref } from 'vue';
import MetronomeV2 from '../core/MetronomeV2';
import MetronomeBars from '../components/MetronomeBars.vue';
import CircularDial from '../components/CircularDial.vue';
import TimeSignatureInput from '../components/TimeSignatureInput.vue';
import SlideTransition from '../components/SlideTransition.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';
import { isMobile } from '../utils/utils';
import ModalCard from '../components/ModalCard.vue';
//eslint-disable-next-line
const snackbar = useSnackbar();
const timeSignatureModalId = "timeSignatureModal";

const renderPage: Ref<boolean> = ref(false);
const isMobileDevice: Ref<boolean | null> = ref(null);

const metronome = reactive(new MetronomeV2());

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

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 200);
}

function showTimeSignatureModal() {
  const modal = document.getElementById(timeSignatureModalId);
  if (modal) (modal as HTMLDialogElement).showModal();
}

onMounted(() => {
  showPage();
  isMobileDevice.value = isMobile();
  metronome.addCallbacks(throwSuccess, throwError);

  if (metronome instanceof MetronomeV2) metronome.setup();
});

</script>