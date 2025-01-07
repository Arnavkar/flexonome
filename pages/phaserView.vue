<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <Transition name="fade-slide">
      <div v-if="renderPage" class="flex flex-row items-center justify-between w-9/12">
        <BaseCard :isTabbed="false" :size="'96'" class="w-full">
          <div id="slidebeatcontainer" class="items-start w-11/12 border-l-4 border-r-4 border-accent">
            <SlidingBeats 
              :bpms="phaser.bpmList" 
              :isRunning="phaser.isRunning" 
              :beats="phaser.beats"
              :width="width"/>
          </div>
        </BaseCard>
        <BpmListInput
          :bpmList="phaser.bpmList"/>
        <button @click="togglePhaser" class="btn btn-primary ml-2  h-3/5">{{ phaser.isRunning ? 'Stop' : 'Start' }}</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, provide } from 'vue';
import type { Ref } from 'vue';
import { isMobile } from '../utils/utils';
import SlidingBeats from '~/components/SlidingBeats.vue';
import BpmListInput from '~/components/BpmListInput.vue';
import BaseCard from '~/components/BaseCard.vue';
import PhaserV2 from '~/core/PhaserV2';

//eslint-disable-next-line
const snackbar = useSnackbar();
const phaser = reactive(new PhaserV2());
const renderPage: Ref<boolean> = ref(false);
const width: Ref<number> = ref(0);
const isMobileDevice: Ref<boolean | null> = ref(null);

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 200);
}

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

function getWidth(){
  const elem = document.getElementById("slidebeatcontainer");
  width.value = elem? elem.offsetWidth : 0
}

function togglePhaser(){
  phaser.toggle()
  getWidth();
}

// function updateBpmList(newBpmList: number[]){
//   console.log("Happens")
//   phaser.bpmList = newBpmList;
//   console.log(phaser.bpmList)
// }

function incrementBeatAccent(index: number) {
  phaser.beats[index].accent = (phaser.beats[index].accent + 1) % 4;
}

provide('incrementBeatAccent',incrementBeatAccent)

onMounted(() => {
  showPage();
  getWidth();
  isMobileDevice.value = isMobile();
  phaser.addCallbacks(throwSuccess, throwError);

  if (phaser instanceof PhaserV2) phaser.setup();
});


</script>