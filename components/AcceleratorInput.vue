<template>
    <div v-if="isAccelerator">
    <Card :isTabbed="false" :size="72">
        <div class="flex flex-col items-center m-2 gap-2">
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Number of Repeats</span>
                <select class="input input-primary text-lg focus:text-primary text-center w-16" v-model.number="numBarsToRepeat">
                    <option v-for="i in 16" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">BPM Increment</span>
                <select class="input input-primary text-lg focus:text-primary text-center w-16 " v-model.number="bpmIncrement">
                    <option v-for="i in bpmIncrements" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Starting BPM</span>
                <input type = "number" class="input input-primary text-md focus:text-primary text-center w-16" v-model.number="startBPM">
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Max BPM</span>
                <input type = "number" class="input input-primary text-md focus:text-primary text-center w-16" v-model.number="maxBpm">
            </div>
            <button @click="emitAccelerator" class="btn btn-primary  w-60">Submit</button>
        </div>
    </Card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from './Card.vue';
import { bpmIncrements } from '~/constants';

const numBarsToRepeat = ref(4);
const bpmIncrement = ref(5);
const startBPM = ref(60);
const maxBpm = ref(120);

const props = defineProps({ 
    isAccelerator: Boolean,
});

defineEmits(["acceleratorSubmit"]);

const emitAccelerator = () => {
    emit("acceleratorSubmit", {numBarsToRepeat: numBarsToRepeat.value, bpmIncrement: bpmIncrement.value, maxBpm: maxBpm.value, startBPM: startBPM.value});
};
</script>

<style scoped>


</style>