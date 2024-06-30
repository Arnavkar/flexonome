<template>
    <Transition name="fade-slide">
      <div v-if="renderMetronome" class="w-full">
        <Metronome />
      </div>
    </Transition>
</template>

<script setup lang="ts">

import {ref , onMounted} from 'vue';
import Metronome from '../components/Metronome.vue';

const renderMetronome: Ref<boolean> = ref(false);

function showMetronome() {
  window.setTimeout(() => {
    renderMetronome.value = true;
  }, 500);
}

onMounted(() => {
    showMetronome();
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
