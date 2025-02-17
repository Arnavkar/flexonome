<template>
  <BaseCard :isTabbed="false" :size="props.isMobile? '56':'96'" :class="props.isMobile? 'border-hidden shadow-none mb-10':''">
  <div class="ring-circles">
    <div class="border-accent border-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"  :style="{
        width: `${radii[1] * 2}px`,
        height: `${radii[1] * 2}px`,
      }">      
      <TransitionGroup name="list">
        <ColorButton
        v-for="(beat,index) in beats_2"
          :key="index"
          ref=circleRefs2
          :beat = "beat"
          class = "border-2 rounded-full"
          :style="getCircleStyle(1, index, beats_2.length)"
        ></ColorButton>
      </TransitionGroup>
    </div>
    <div class="border-primary border-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :style="{
        width: `${radii[0] * 2}px`,
        height: `${radii[0] * 2}px`,
      }">      
      <TransitionGroup name="list">
      <ColorButton
        v-for="(beat,index) in beats_1"
        :key="index"
        ref=circleRefs1
        :beat = "beat"
        class = "border-2 rounded-full"
        :style="getCircleStyle(0, index, beats_1.length)"
      ></ColorButton>
      </TransitionGroup>
    </div>
  </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import BaseCard from './BaseCard.vue';
import ColorButton from './ColorButton.vue';
import type { Beat } from '../utils/types';

// Props
const props = defineProps<{
  beats_1: Beat[];
  beats_2: Beat[];
  activeCircles_1: number;
  activeCircles_2: number;
  isMobile: boolean;
}>();

const circleRefs1 = ref();
const circleRefs2 = ref();
const ringSize = props.isMobile? 250: 350;

const radii = computed(() => {
  if (!props.isMobile) {
    const maxRadius = ringSize / 2 - 10; // Leave some padding
    const minRadius = maxRadius * 0.5+30;
    return [minRadius, maxRadius];
  } else {
    const maxRadius = ringSize / 5 ; // Leave some padding
    const minRadius = maxRadius * 0.6;
    return [minRadius, maxRadius];
  }
});

const getCircleStyle = (index: number, i: number, count: number) => {
  const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
  const radius = radii.value[index];
  const circleDiameter = props.isMobile? 12: 30
  const x = radius * Math.cos(angle) - circleDiameter / 2;
  const y = radius * Math.sin(angle) - circleDiameter / 2;

  return {
    position: 'absolute',
    top: `calc(50% + ${y}px)`,
    left: `calc(50% + ${x}px)`,
    width: `${circleDiameter}px`,
    height: `${circleDiameter}px`,
  };
};

watch(()=> props.activeCircles_1, async(newVal) => {
  await nextTick();
  if (newVal >= 0 && newVal!== props.beats_1.length) {
    circleRefs1.value[newVal]?.tic();
  }
});

watch(()=> props.activeCircles_2, async(newVal) => {
  await nextTick();
  if (newVal >= 0 && newVal!== props.beats_2.length) {
    circleRefs2.value[newVal]?.tic();
  }
});

</script>

<style scoped>
.ring-circles {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circle {
  transform: translate(-50%, -50%);
}
</style>