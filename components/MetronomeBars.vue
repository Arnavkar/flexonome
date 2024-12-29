<template>
    <div class="flex flex-wrap items-center justify-center gap-4 max-w-screen-sm m-4 pl-12 pr-12">
      <TransitionGroup name="list">
        <ColorButton 
        v-for="(beat, index) in beats"
        :key="index"
        :beat="beat"
        ref="buttons"
        class="rounded-lg"
        />
      </TransitionGroup>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch, onUpdated, nextTick, computed} from 'vue';
import type { Beat } from '../utils/types';
import ColorButton from './ColorButton.vue';

// Define props
const props = defineProps<{
    beats: Beat[]
    activeBar:number
}>();

// Empty Reference to the ColorButton components declared in template
const buttons = ref();
const beatUnitList = computed(() => props.beats.map((beat) => beat.beatUnit));

// Watch for changes in the activeBar prop and call tic on the corresponding button
watch(() => props.activeBar, (newActiveBar) => {
  if (newActiveBar >= 0 && newActiveBar !== props.beats.length) {
    buttons.value[newActiveBar]?.tic();
  }
});

//If beats changes - update the width of the buttons accordingly
watch(() => beatUnitList, async(newBeatUnitList) => {
  await nextTick();
  buttons.value.forEach((button:typeof ColorButton, index:number) => {
    button.updateWidth(newBeatUnitList.value[index]);
  });
});

//Make sure width styling is updated when beatUnit /num Bar changes
onUpdated(() => {
});
</script>