<template>
  <Card :isTabbed="false" :size="96">
  <div class="ring-circles">
    <div class="border-primary border-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :style="{
        width: `${radii[0] * 2}px`,
        height: `${radii[0] * 2}px`,
      }">      
      <ColorButton
        v-for="(n,index) in x"
        :key="n"
        ref=circleRefs1
        :index = "index"
        class = "border-4"
        :style="getCircleStyle(0, index, x)"
      ></ColorButton>
    </div>
    <div class="border-accent border-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"  :style="{
        width: `${radii[1] * 2}px`,
        height: `${radii[1] * 2}px`,
      }">      
      <ColorButton
      v-for="(n,index) in y"
        :key="n"
        ref=circleRefs2
        :index = "index"
        class = "border-4"
        :style="getCircleStyle(1, index, y)"
      ></ColorButton>
    </div>
  </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Card from './Card.vue';
import ColorButton from './ColorButton.vue';

// Props
const props = defineProps<{
  x: number;
  y: number;
  size: number;
  activeCircles_1: number;
  activeCircles_2: number;
}>();

const circleRefs1 = ref();
const circleRefs2 = ref();

const radii = computed(() => {
  const maxRadius = props.size / 2 - 10; // Leave some padding
  const minRadius = maxRadius * 0.5+30;
  return [minRadius, maxRadius];
});

const getCircleStyle = (index: number, i: number, count: number) => {
  const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
  const radius = radii.value[index];
  const circleDiameter = 30
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

watch(()=> props.activeCircles_1, (newVal) => {
  if (newVal >= 0 && newVal!== props.x) {
    circleRefs1.value[newVal]?.tic();
  }
});

watch(()=> props.activeCircles_2, (newVal) => {
  if (newVal >= 0 && newVal!== props.y) {
    circleRefs2.value[newVal]?.tic();
  }
});

watch(()=> props.x, () => {
  circleRefs1.value.forEach((circle:any) => {
    circle.setColorAndSound(0);
  });
});

watch(()=> props.y, () => {
  circleRefs2.value.forEach((circle:any) => {
    circle.setColorAndSound(2);
  });
});

onMounted(() => {
  circleRefs2.value.forEach((circle: any) => {
    circle.setColorAndSound(2);
  });
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