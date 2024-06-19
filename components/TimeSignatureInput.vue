<template>
    <Card>
        <div class="flex flex-col w-12 items-center">
            <select 
                class="input input-ghost text-5xl focus:text-primary text-center w-20 h-20" 
                v-model.number="numBeats" 
                @change="emitNumBeatsChange"
            >
            <option v-for="value in numBeatValues" :key="value" :value="value">{{ value }}</option>
            </select>           
            <div class="divider divider-primary mt-0 mb-0"></div>
            <select 
                class="input input-ghost text-5xl focus:text-primary text-center w-20 h-20" 
                v-model.number="beatUnit" 
                @change="emitBeatValueChange"
            >
            <option v-for="value in beatUnitValues" :key="value" :value="value">{{ value }}</option>
            </select>      
        </div>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { numBeatValues, beatUnitValues } from '../constants';
import Card from './Card.vue';

const emit = defineEmits(["numBeatsChange", "beatUnitChange"]);

const numBeats = ref(4);
const beatUnit = ref(4);

const emitNumBeatsChange = () => {
  emit("numBeatsChange", numBeats.value);
};

const emitBeatValueChange = () => {
  emit("beatUnitChange", beatUnit.value);
};
</script>