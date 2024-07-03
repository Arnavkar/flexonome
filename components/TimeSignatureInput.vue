<template>
    <Card :isTabbed="true" :size="64" @activeTab="handleTabChange">
        <template #single>
            <div class="flex flex-col w-12 h-44 items-center">
                <select class="input input-ghost text-5xl focus:text-primary text-center w-24 h-20" v-model.number="numBeats" @change="emitNumBeatsChange">
                    <option v-for="value in numBeatValues" :key="value" :value="value">{{ value }}</option>
                </select>           
            <div class="divider divider-primary mt-0 mb-0"></div>
                <select class="input input-ghost text-5xl focus:text-primary text-center w-24 h-20" v-model.number="beatUnit" @change="emitBeatValueChange">
                    <option v-for="value in beatUnitValues" :key="value" :value="value">{{ value }}</option>
                </select>      
            </div>
        </template>
        <template #multiple>
        <div class="flex flex-col justify-between h-44 items-center">
            <textarea 
            type="text" 
            class="input input-ghost text-xl w-60 h-28 text-center dark:focus:bg-neutral focus:bg-gray-200"
            v-model="inputString"
            placeholder="Enter a time signature string (eg. 4/4 & 3/8 )"
            />
            <button class="btn btn-primary mt-2 w-1/2 btn-outline" @click="emitInputStringChange">Submit</button>
        </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { numBeatValues, beatUnitValues } from '../constants';
import Card from './Card.vue';

const emits = defineEmits(["numBeatsChange", "beatUnitChange","multipleTimeSignatureSubmit"]);
const numBeats = ref(4);
const beatUnit = ref(4);
const inputString = ref("");

const emitNumBeatsChange = () => {
    emits("numBeatsChange", numBeats.value);
};

const emitBeatValueChange = () => {
    emits("beatUnitChange", beatUnit.value);
};

const emitInputStringChange = () => {
    emits("multipleTimeSignatureSubmit", inputString.value);
};

function handleTabChange(tab: string) {
    if (tab === "tab-1") {
        emitBeatValueChange();
        emitNumBeatsChange();
    } else if (inputString.value !== '') {
        emitInputStringChange();
    }
}
</script>