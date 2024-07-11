<template>
    <Transition name="fade-slide">
      <div v-if="renderPage" class="flex flex-col items-center justify-between w-9/12">
        <div id="slidebeatcontainer" class="flex flex-row items-start w-8/12 border-l-4 border-r-4 border-accent">
          <SlidingBeats :bpms="bpmList" :isRunning="isRunning" :width="width"/>
        </div>
        <BpmListInput @inputChange = "updateBpmList"/>
        <button @click="togglePhaser" class="btn btn-primary btn-outline mt-4 w-60">{{ isRunning ? 'Stop' : 'Start' }}</button>
      </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SlidingBeats from '~/components/SlidingBeats.vue';
import BpmListInput from '~/components/BpmListInput.vue';

const bpmList: Ref<number[]> = ref([]);
const isRunning: Ref<boolean> = ref(false);
const renderPage: Ref<boolean> = ref(false);
const width: Ref<number> = ref(0);

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 500);
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