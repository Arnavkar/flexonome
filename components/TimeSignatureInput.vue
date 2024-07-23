<template>
    <Card :isTabbed="true" :size="80" @activeTab="handleTabChange">
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
        <div class="flex flex-col justify-between mt-4 items-center">
            <textarea 
            type="text" 
            class="input border-2 border-gray-500 text-xl w-60 h-28 text-center dark:focus:bg-neutral focus:bg-gray-200"
            v-model="inputString"
            placeholder="Enter a time signature string (eg. 4/4 & 3/8 )"
            />
            <div class="grid mt-2 mb-2">
                <a v-for="denum in [4,8]">
                    <button v-for="num in [2,3,4,5,6,7]" :id="`${num}/${denum}`" @click="AddTimeSig(`${num}/${denum}`)" class="btn btn-xs btn-primary m-1">{{ num }}/{{ denum }}</button>
                </a>
            </div>
        </div>
        <div class="flex justify-evenly">
            <button class="btn btn-outline btn-primary" @click="emitInputStringChange">Submit</button>
            <button class="btn  btn-neutral" onclick="help_modal.showModal()">Help</button>
        </div>
        <!-- Open the modal using ID.showModal() method -->
        <dialog id="help_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Multiple Time Signatures</h3>
            <ul class="mt-4 ml-4 list-disc">
                <li>Input Time signatures by clicking the provided buttons</li>
                <li>Manually Time Signature values in the textbox, separated '&' </li>
                <li> <span>If you want multiple bars of the same time signature, you can enclose the value in brackets and multiply by the desired number of bars <i>(Eg. (2/4)*2)</i></span></li>
            </ul>
            <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
            </form>
            </div>
        </div>
        </dialog>
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

function AddTimeSig(timeSigString: string) {
    if (inputString.value === "") {
        inputString.value = timeSigString;
    } else {
        inputString.value += ` & ${timeSigString}`;
    }
}
</script>