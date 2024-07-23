<template>
    <div class="flex flex-wrap gap-4 max-w-screen-sm m-4 pl-12 pr-12">
      <TransitionGroup name="list">
        <ColorButton 
        v-for="n in numBeats"
        :key="n"
        ref = buttons
        class = "rounded-lg"
        />
      </TransitionGroup>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch, onUpdated} from 'vue';
import ColorButton from './ColorButton.vue';

// Define props
const props = defineProps<{
    numBeats: number
    beatUnit: number[]
    activeBar:number
    accents:number[]
}>();

// Initialize numBars with the prop value or default to 4
const beatUnit = ref(props.beatUnit);

// Empty Reference to the ColorButton components declared in template
const buttons = ref();

// Watch for changes in the activeBar prop and call tic on the corresponding button
watch(() => props.activeBar, (newVal) => {
  if (newVal >= 0 && newVal !== props.numBeats) {
    buttons.value[newVal]?.tic();
  }
});

watch(() => props.beatUnit, (newVal) => {
  beatUnit.value = newVal;
  console.log(props.accents)
});

onMounted(() => {
  buttons.value[0].cycleColorAndSound();
});

//Make sure width styling is updated when beatUnit /num Bar changes
onUpdated(() => {
  buttons.value.forEach((button: any, index:number) => {
    button.updateWidth(beatUnit.value[index]);
    if (props.accents[index]==1){
      buttons.value[index].setColorAndSound(1);
    }
  });
});
</script>