<template>        
  <BaseCard :isTabbed="false" :size="80">
    <div class= "flex items-center gap-10">
        <div class="flex flex-col items-center gap-4">
        <div v-for="(input, index) in inputs" :key="index">
            <input type="number" v-model="inputs[index]" class="input border-2 dark:border-gray-700 border-gray-300 text-3xl text-primary text-center w-24 h-12" />
        </div>
        </div>
        <div class="flex flex-col items-center">
            <button v-if="inputs.length < 10" @click="addInput" class="w-12 h-12 border-primary text-primary border-2 rounded-md m-2">+</button>
            <button v-if="inputs.length > 1" @click="removeInput" class="w-12 h-12 border-secondary text-secondary border-2 rounded-md m-2">-</button>
        </div>
    </div>
  </BaseCard>
</template>
  
  <script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import BaseCard from './BaseCard.vue';

  const emits = defineEmits(["inputChange",]);
  
  // Reactive list of inputs
  const inputs:ref<number[]> = ref([120,60]); // Start with one input initialized to 0
  
  // Function to add an input
  const addInput = () => {
    inputs.value.push(120); // Add a new input initialized to 120
  };
  // Function to remove an input
  function removeInput(){
    inputs.value.splice(inputs.value.length-1, 1); // Remove the input at the specified index
  };

  watchEffect(() => {
    emits("inputChange", inputs.value);
  });

  </script>
  