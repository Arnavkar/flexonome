<template>
    <Card :isTabbed="false" :size="72">
        <div class="flex flex-col items-center m-2">
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Number of Repeats</span>
                <select class="input input-primary text-lg focus:text-primary text-center m-4 w-16" v-model.number="numBarsToRepeat">
                    <option v-for="i in 16" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">BPM Increment</span>
                <select class="input input-primary text-lg focus:text-primary text-center m-4 w-16 " v-model.number="bpmIncrement">
                    <option v-for="i in bpmIncrements" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Starting BPM</span>
                <input type = "number" class="input input-primary text-md focus:text-primary text-center m-4 w-16" v-model.number="startBPM">
            </div>
            <div class = "flex items-center justify-between w-full">
                <span class="text-md">Max BPM</span>
                <input type = "number" class="input input-primary text-md focus:text-primary text-center m-4 w-16" v-model.number="maxBpm">
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, watch, defineProps } from 'vue';
import Card from './Card.vue';
import { bpmIncrements } from '~/constants';

const numBarsToRepeat = ref(4);
const bpmIncrement = ref(5);
const maxBpm = ref(120);
const startBPM = ref(60);
</script>
