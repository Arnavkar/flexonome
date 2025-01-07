<template>        
  <BaseCard :isTabbed="false" :size="'80'">
    <div class= "flex items-center gap-10">
        <div class="flex flex-col items-center gap-4">
        <div v-for="(bpm, index) in bpmList" :key="index">
            <input type="number" class="input border-2 dark:border-gray-700 border-gray-300 text-3xl text-primary text-center w-24 h-12" />
        </div>
        </div>
        <div class="flex flex-col items-center">
            <button v-if="bpmList.length < 10" @click="addInput" class="w-12 h-12 border-primary text-primary border-2 rounded-md m-2">+</button>
            <button v-if="bpmList.length > 1" @click="removeInput" class="w-12 h-12 border-secondary text-secondary border-2 rounded-md m-2">-</button>
        </div>
    </div>
  </BaseCard>
</template>
  
  <script setup lang="ts">
  import BaseCard from './BaseCard.vue';

  const props = defineProps<{
    bpmList: number[];
    addBpm?: (bpm: number) => void;
    removeBpm?: (index: number) => void;
    updateBpm?: (index: number, bpm: number) => void;
  }>();
  
  // Function to add an input
  const addInput = () => {
    
  };

  // Function to remove an input
  const removeInput = () =>{
  };

  </script>
  