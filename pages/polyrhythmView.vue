<template>
  <div>
  <Transition name="fade-slide">
    <div v-if="renderPage">
      <div v-if="!isMobileDevice" class="flex flex-col items-center justify-between">
        <div class="grid grid-cols-3 mt-8">
          <div class="flex flex-col items-end justify-center">
            <RatioInput 
              @ratio1Change="(newVal) => polyrhythm.updateRatio(0,newVal)" 
              @ratio2Change="(newVal) => polyrhythm.updateRatio(1,newVal)"/>
            <CircularDial 
              :bpm="polyrhythm.bpm" 
              :acceleratorOptions="polyrhythm.accelerator" 
              :progress="polyrhythm.accelerator.progress" 
              @updateBpm="(newBpm) => polyrhythm.updateBpm(newBpm)"
              @toggleAccelerator="() => polyrhythm.toggleAccelerator()" />
          </div>
          <PolyrhythmDial
            :beats_1="polyrhythm.beats_1" 
            :beats_2="polyrhythm.beats_2" 
            :activeCircles_1="polyrhythm.activeCircles[0]" 
            :activeCircles_2="polyrhythm.activeCircles[1]"
            :size="350" />
          <div class="flex flex-col items-start justify-center">
            <SlideTransition>
              <AcceleratorInput 
                v-if="polyrhythm.acceleratorEnabled"
                @acceleratorOptionsSubmit="(options) => polyrhythm.setAccelerator(options)" />
            </SlideTransition>
          </div>
        </div>
        <button @click="() => polyrhythm.toggle()" class="btn btn-primary btn-outline mt-4 w-60">{{ polyrhythm.isRunning ? 'Stop' : 'Start'}}</button>
      </div>
      <div v-if="isMobileDevice" class="flex flex-col items-center justify-between w-96 mt-10">
        <CircularDial 
          :bpm="polyrhythm.bpm" 
          :acceleratorOptions="polyrhythm.accelerator" 
          :progress="polyrhythm.accelerator.progress" 
          @updateBpm="(newBpm) => polyrhythm.updateBpm(newBpm)"
          @toggleAccelerator="() => polyrhythm.toggleAccelerator()" />
          <div class="flex justify-around items-center">
            <ModalCard 
              :modal-id="ratioModalId"
              @click="show(ratioModalId)">
              <template #buttonui>
                <span>
                  <label class="text-2xl">{{ polyrhythm.ratios[0] }}</label>
                  <label class="text-2xl"> : </label>
                  <label class="text-2xl">{{ polyrhythm.ratios[1] }}</label>
                </span>
              </template>
              <template #modal>
                <RatioInput 
                  @ratio1Change="(newVal) => polyrhythm.updateRatio(0,newVal)" 
                  @ratio2Change="(newVal) => polyrhythm.updateRatio(1,newVal)"/>
              </template>
            </ModalCard>
            <button class="btn btn-primary btn-outline w-24 h-24" @click="() => polyrhythm.toggle()">
              {{ polyrhythm.isRunning ? 'Stop' : 'Start' }}
            </button>
            <ModalCard 
              :modal-id="acceleratorModalId"
               @click="polyrhythm.acceleratorEnabled? show(acceleratorModalId) : null">
               <template #buttonui>
                <MdiIcon
                  icon="mdiFastForward" 
                  :class="IconStyle"/>
                <label :class="IconStyle" class="text-xs text-center p-0 m-0"> settings </label>
              </template>
              <template #modal>
                <AcceleratorInput 
                  v-if="polyrhythm.acceleratorEnabled"
                  @acceleratorOptionsSubmit="(options) => polyrhythm.setAccelerator(options)"/>
              </template>
            </ModalCard>
          </div>
      </div>
    </div>
  </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, provide, computed } from 'vue';
import type { Ref } from 'vue';
import CircularDial from '../components/CircularDial.vue';
import SlideTransition from '../components/SlideTransition.vue';
import AcceleratorInput from '../components/AcceleratorInput.vue';
import PolyRhythmV2 from '../core/PolyRhythmV2';
import PolyrhythmDial from '~/components/PolyrhythmDial.vue';
import { isMobile } from '../utils/utils';

//eslint-disable-next-line
const snackbar = useSnackbar();
const renderPage: Ref<boolean> = ref(false);
const isMobileDevice: Ref<boolean | null> = ref(null);
const polyrhythm = reactive(new PolyRhythmV2());

const ratioModalId = "ratioModal";
const acceleratorModalId = "acceleratorModal";

const IconStyle = computed(() => {
    return polyrhythm.acceleratorEnabled? `text-primary` : `opacity-30`;
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

function show(id:string) {
  const modal = document.getElementById(id);
  if (modal) (modal as HTMLDialogElement).showModal();
}

function incrementBeatAccent(index: number) {
  polyrhythm.beats[index].accent = (polyrhythm.beats[index].accent + 1) % 4;
}

provide('incrementBeatAccent',incrementBeatAccent)

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 500);
}

onMounted(() => {
  showPage();
  isMobileDevice.value = isMobile();
  polyrhythm.addCallbacks(throwSuccess, throwError);

  if (polyrhythm instanceof PolyRhythmV2) polyrhythm.setup();
});

</script>