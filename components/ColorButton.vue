<template>
  <div class="flex items-center">
    <button 
      class="border-2 relative"
      :class="[
        currentBorderColor, 
        isFlashing ? currentBackgroundColor : 'dark:bg-slate-800 bg-slate-200',
        buttonClass
      ]"
      :style="buttonStyle"
      @click="incrementBeatAccent(beat.beatIndex);">
    </button>
    
    <!-- Subdivision indicators -->
    <div v-if="beat.subdivision > 1" class="flex flex-col ml-2 gap-1.5">
      <div 
        v-for="i in beat.subdivision - 1" 
        :key="i" 
        class="w-2 h-2 rounded-full cursor-pointer" 
        :class="[
          beat.subdivisionEnabled[i-1] ? 'bg-primary': 'bg-gray-400 dark:bg-gray-600 opacity-40'
        ]"
        @click="toggleSubdivision(i-1)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject} from 'vue';
import type { Beat } from '../utils/types';

const borderColors: string[] = ['border-primary', 'border-secondary', 'border-accent', 'border-gray-400'];
const bgColors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-gray-400'];

const props = defineProps<{
  beat: Beat;
  buttonClass?: string;
  buttonStyle?: string;
}>();

const incrementBeatAccent = inject('incrementBeatAccent') as (beatIndex: number) => void;
const emits = defineEmits(['updateSubdivision']);

const isFlashing = ref(false);

const currentBorderColor = computed(() => borderColors[props.beat.accent]);
const currentBackgroundColor = computed(() => bgColors[props.beat.accent]);

function toggleSubdivision(index: number) {
  const updatedSubdivisions = [...props.beat.subdivisionEnabled];
  updatedSubdivisions[index] = !updatedSubdivisions[index];
  
  // Emit event with updated beat
  emits('updateSubdivision', {
    ...props.beat,
    subdivisionEnabled: updatedSubdivisions
  });
}

function tic() {
  isFlashing.value = true;
  setTimeout(() => {
    isFlashing.value = false;
  }, 50); // Flash duration in milliseconds
}

defineExpose({ tic });

</script>