<template>
    <BaseCard :isTabbed="false" :size="72">
        <div class="flex flex-col items-center m-2 gap-2">
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Number of Repeats</span>
                <select class="input input-primary text-lg focus:text-primary text-center w-16" v-model.number="acceleratorOptions.numBarsToRepeat">
                    <option v-for="i in 16" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">BPM Increment</span>
                <select class="input input-primary text-lg focus:text-primary text-center w-16 " v-model.number="acceleratorOptions.bpmIncrement">
                    <option v-for="i in bpmIncrements" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Starting BPM</span>
                <input type = "number" class="input input-primary text-md focus:text-primary text-center w-16" v-model.number="acceleratorOptions.startBPM">
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Max BPM</span>
                <input type = "number" class="input input-primary text-md focus:text-primary text-center w-16" v-model.number="acceleratorOptions.maxBpm">
            </div>
            <button @click="emitAccelerator" class="btn btn-primary btn-outline  w-60">Submit</button>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseCard from './BaseCard.vue';
import { bpmIncrements } from '~/constants';
import type { Accelerator } from '../utils/types';

const acceleratorOptions: ref<Accelerator> = ref({
    numBarsToRepeat: 4,
    bpmIncrement: 5,
    startBPM: 120,
    maxBpm: 180
});

const emits = defineEmits(["acceleratorOptionsSubmit"]);

const emitAccelerator = () => {
    emits("acceleratorOptionsSubmit", acceleratorOptions.value);
};
</script>

<style scoped>


</style>