<template>
  <button 
    class="border-2"
    :class="[
      buttonHeight, 
      currentBorderColor, 
      currentWidth,
      isFlashing ? currentBackgroundColor : 'dark:bg-slate-800 bg-slate-200'
    ]"
    @click="incrementBeatAccent(beat.beatIndex);">
  </button>
</template>

<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue';
import type { Beat } from '../utils/types';
import { buttonWidthMap } from '../constants';

const isMobile = inject('isMobile') as Ref<boolean>;
const borderColors: string[] = ['border-primary', 'border-secondary', 'border-accent', 'border-gray-400'];
const bgColors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-gray-400'];

const props = defineProps<{beat: Beat}>();
const incrementBeatAccent = inject('incrementBeatAccent') as (beatIndex: number) => void;

const isFlashing = ref(false);

const currentBorderColor = computed(() => borderColors[props.beat.accent]);
const currentBackgroundColor = computed(() => bgColors[props.beat.accent]);
const currentWidth = computed(() => buttonWidthMap[props.beat.beatUnit]);
const buttonHeight = computed(() => isMobile.value? 'h-8' : 'h-12');

function tic() {
  isFlashing.value = true;
  setTimeout(() => {
    isFlashing.value = false;
  }, 50); // Flash duration in milliseconds
}

defineExpose({ tic });

</script>