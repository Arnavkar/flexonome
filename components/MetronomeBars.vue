<template>
    <div class="max-h-[25vh] overflow-y-auto scrollbar-thumb-primary scrollbar-track-base-200 p-2 scroll-smooth max-w-[90vw]" :class="isMobile ? 'pt-10' : ''">
      <TransitionGroup name="list">
        <div v-for="barNumber in maxBar" 
             :key="barNumber" 
             :ref="el => { if(barNumber === currentBar) activeBarRef = el as HTMLElement }"
             class="flex items-center gap-4 m-4 relative">
          <span class="absolute -left-6 text-sm opacity-50 w-4">{{ barNumber }}</span>
          <div class="overflow-x-auto w-full" :id="`bar-container-${barNumber}`">
            <div class="flex gap-4 items-center justify-center min-w-max px-4">
              <ColorButton 
                v-for="beat in getBeatsForBar(barNumber)"
                :key="beat.beatIndex"
                :beat="beat"
                ref="buttons"
                :id="`beat-${beat.beatIndex}`"
                class="rounded-lg"
              />
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch, nextTick, computed, inject, type Ref } from 'vue';
import type { Beat } from '../utils/types';
import ColorButton from './ColorButton.vue';

// Define props
const props = defineProps<{
    beats: Beat[]
    activeBeat: number
}>();

const activeBarRef = ref<HTMLElement | null>(null);
const buttons = ref();
const beatUnitList = computed(() => props.beats.map((beat) => beat.beatUnit));
const maxBar = computed(() => Math.max(...props.beats.filter(beat => beat.bar !== -1).map(beat => beat.bar || 1)));
const isMobile = inject('isMobile') as Ref<boolean>;

const currentBar = computed(() => {
  const currentBeat = props.beats[props.activeBeat];
  return currentBeat?.bar === -1 ? 1 : (currentBeat?.bar || 1);
});

function getBeatsForBar(barNumber: number) {
  return props.beats.filter(beat => beat.bar === barNumber);
}

// Watch for changes in the activeBeat prop and call tic on the corresponding button
watch(() => props.activeBeat, async (newActiveBeat) => {
  if (newActiveBeat >= 0 && newActiveBeat !== props.beats.length) {
    buttons.value[newActiveBeat]?.tic();
  }
  
  // Scroll to active beat horizontally
  await nextTick();
  const activeBeatElement = document.getElementById(`beat-${newActiveBeat}`);
  const barContainer = document.getElementById(`bar-container-${currentBar.value}`);
  
  if (activeBeatElement && barContainer) {
    activeBeatElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
});

// Watch for bar changes and scroll vertically to make it visible
watch(activeBarRef, async () => {
  await nextTick()
  if (activeBarRef.value) {
    activeBarRef.value.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center'
    });
  }
});

//If beats changes - update the width of the buttons accordingly
watch(() => beatUnitList, async(newBeatUnitList) => {
  await nextTick();
  buttons.value.forEach((button:typeof ColorButton, index:number) => {
    button.updateWidth(newBeatUnitList.value[index]);
  });
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
  height: 4px;
  background-color: rgba(240, 240, 240, 0.2);
}
</style>