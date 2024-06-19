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
import { ref, watch} from 'vue';
import ColorButton from './ColorButton.vue';

// Define props
const props = defineProps<{
    timeSignature: number
    activeBar:number
}>();

// Initialize numBars with the prop value or default to 4
const numBars = ref(props.timeSignature || 4);   

// Watch for changes in the timeSignature prop and update numBars
watch(() => props.timeSignature, (newVal) => {
    numBars.value = newVal;
});

watch(() => props.activeBar, (newVal) => {
    console.log(`Active bar changed to ${newVal}`);
});

// References to the ColorButton components
const buttons = ref([]);

// Watch for changes in the activeBar prop and call tic on the corresponding button
watch(() => props.activeBar, (newVal) => {
  if (newVal >= 0 && newVal < buttons.value.length) {
    buttons.value[newVal+4]?.tic();
  }
});

onMounted(() => {
  buttons.value = Array.from({ length: numBars.value }, () => null);
});

</script>
