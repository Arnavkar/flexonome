<template>
    <div class="flex space-x-4 mb-4">
        <ColorButton 
        v-for="(n, index) in numBars"
        :key="n"
        ref = buttons
        :index = "index"/>
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
}>();

// Initialize numBars with the prop value or default to 4
const numBars = ref(props.numBeats);   
const beatUnit = ref(props.beatUnit);

// Empty Reference to the ColorButton components declared in template
const buttons = ref();

// Watch for changes in the timeSignature prop and update numBars
watch(() => props.numBeats, (newVal) => {
    numBars.value = newVal; 
});

// Watch for changes in the activeBar prop and call tic on the corresponding button
watch(() => props.activeBar, (newVal) => {
  if (newVal >= 0 && newVal !== numBars.value) {
    buttons.value[newVal]?.tic();
  }
});

watch(() => props.beatUnit, (newVal) => {
  beatUnit.value = newVal;
});

onMounted(() => {
  buttons.value[0].cycleColorAndSound();
});

//Make sure width styling is updated when beatUnit /num Bar changes
onUpdated(() => {
  buttons.value.forEach((button: any, index:number) => {
    button.updateWidth(beatUnit.value[index]);
  });
});
</script>
