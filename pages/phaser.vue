<template>
    <Transition name="fade-slide">
      <div v-if="renderPage" class="flex flex-col items-center justify-between">
        <div class="flex flex-row items-start w-full">
          <SlidingBeats :bpms="bpmList" :isRunning="isRunning"/>
        </div>
        <BpmListInput @inputChange = "updateBpmList"/>
        <button @click="isRunning = !isRunning" class="btn btn-primary btn-outline mt-4 w-60">{{ isRunning ? 'Stop' : 'Start' }}</button>
      </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SlidingBeats from '~/components/SlidingBeats.vue';
import BpmListInput from '~/components/BpmListInput.vue';

const bpmList: Ref<number[]> = ref([124, 120]);
const isRunning: Ref<boolean> = ref(false);
const renderPage: Ref<boolean> = ref(false);

function showPage() {
  window.setTimeout(() => {
    renderPage.value = true;
  }, 500);
}

function updateBpmList(newBpmList: number[]){
  bpmList.value = newBpmList;
}

onMounted(() => {
    showPage();
});


</script>