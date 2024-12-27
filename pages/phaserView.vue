<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <Transition name="fade-slide">
      <div v-if="renderPage" class="flex flex-row items-center justify-between w-9/12">
        <BaseCard :isTabbed="false" :size="96" class="w-full">
          <div id="slidebeatcontainer" class="items-start w-11/12 border-l-4 border-r-4 border-accent">
            <SlidingBeats :bpms="bpmList" :isRunning="isRunning" :width="width"/>
          </div>
        </BaseCard>
        <BpmListInput @inputChange = "updateBpmList"/>
        <button @click="togglePhaser" class="btn btn-primary ml-2  h-3/5">{{ isRunning ? 'Stop' : 'Start' }}</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted  } from 'vue';
import type { Ref } from 'vue';
import SlidingBeats from '~/components/SlidingBeats.vue';
import BpmListInput from '~/components/BpmListInput.vue';
import BaseCard from '~/components/BaseCard.vue';

const bpmList: Ref<number[]> = ref([]);
const isRunning: Ref<boolean> = ref(false);
const renderPage: Ref<boolean> = ref(false);
const width: Ref<number> = ref(0);

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 200);
}

function getWidth(){
  const elem = document.getElementById("slidebeatcontainer");
  width.value = elem? elem.offsetWidth : 0
}

function togglePhaser(){
  isRunning.value = !isRunning.value;
  getWidth();
}

function updateBpmList(newBpmList: number[]){
  bpmList.value = newBpmList;
}

onMounted(() => {
  showPage();
  getWidth();
});


</script>