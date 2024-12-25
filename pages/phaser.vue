<template>
    <Transition name="fade-slide">
      <div v-if="renderPage" class="flex flex-row items-center justify-between w-9/12">
        <Card :isTabbed="false" :size="96" class="w-full">
          <div id="slidebeatcontainer" class="items-start w-11/12 border-l-4 border-r-4 border-accent">
            <SlidingBeats :bpms="bpmList" :isRunning="isRunning" :width="width"/>
          </div>
        </Card>
        <BpmListInput @inputChange = "updateBpmList"/>
        <button @click="togglePhaser" class="btn btn-primary ml-2  h-3/5">{{ isRunning ? 'Stop' : 'Start' }}</button>
      </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted  } from 'vue';
import SlidingBeats from '~/components/SlidingBeats.vue';
import BpmListInput from '~/components/BpmListInput.vue';
import Card from '~/components/Card.vue';

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