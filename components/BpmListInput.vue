<template>        
  <BaseCard :isTabbed="false" :size="'66'">
    <div class= "flex items-center gap-1">
        <div class="flex flex-col items-center gap-4">
        <div v-for="(_, index) in inputList" :key="index">
            <input type="number" v-model="inputList[index]" class="input border-2 dark:border-gray-700 border-gray-300 text-3xl text-primary text-center w-24 h-12" />
        </div>
        </div>
        <div class="flex flex-col items-center">
            <button v-if="props.bpmList.length < MAX_BPMS" @click="() => props.addBpm()" class="w-12 h-12 border-primary text-primary border-2 rounded-md m-2">+</button>
            <button v-if="props.bpmList.length > 1" @click="() => props.removeBpm()" class="w-12 h-12 border-secondary text-secondary border-2 rounded-md m-2">-</button>
        </div>
    </div>
  </BaseCard>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import BaseCard from './BaseCard.vue';
  import type { Beat } from '../utils/types';

  const props = defineProps<{
    bpmList: number[];
    beats: Beat[];
    addBpm: () => void;
    removeBpm: () => void;
  }>();

  const inputList:Ref<number[]> = ref(props.bpmList)
  const MAX_BPMS = 8

  </script>
  