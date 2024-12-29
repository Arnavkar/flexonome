<template>
  <button 
    class="border-2"
    :class="[buttonHeight, currentBorderColor, currentBackgroundColor, currentWidth, {'active-state': isFlashing, 'dark:bg-slate-800 bg-slate-200': !isFlashing }]"
    @click="incrementBeatAccent(beat.beatIndex)">
  </button>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import type { Beat } from '../utils/types';
import { buttonWidthMap } from '../constants';
import { isMobile } from '../utils/utils';

const borderColors: string[] = ['border-primary', 'border-secondary', 'border-accent', 'border-gray-400'];
const bgColors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-gray-400'];

const props = defineProps<{beat: Beat}>();
const incrementBeatAccent = inject('incrementBeatAccent');

const isFlashing = ref(false);

const currentBorderColor = computed(() => borderColors[props.beat.accent]);
const currentBackgroundColor = computed(() => bgColors[props.beat.accent]);
const currentWidth = computed(() => buttonWidthMap[props.beat.beatUnit]);
const  buttonHeight = computed(() => isMobile()? 'h-8' : 'h-12');

function tic() {
  isFlashing.value = true;
  setTimeout(() => {
    isFlashing.value = false;
  }, 50); // Flash duration in milliseconds
}

defineExpose({ tic });

</script>

<style scoped>
.active-state {
  background-color: 'white';
}
</style>