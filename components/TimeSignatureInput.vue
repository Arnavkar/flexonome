<template>
    <BaseCard :isTabbed="true" @activeTab="handleTabChange" :size="'80'" class="min-w-[280px] w-[280px]"> <!--  -->
        <template #tab1>
            <div class="flex flex-col h-44 items-center justify-center">
                <select class="input input-ghost text-5xl focus:text-primary h-20" v-model.number="numBeats"
                    @change="emitTimeSignatureChange">
                    <option v-for="value in numBeatValues" :key="value" :value="value">{{ value }}</option>
                </select>
                <div class="divider divider-primary mt-0 mb-0"></div>
                <select class="input input-ghost text-5xl focus:text-primary h-20" v-model.number="beatUnit"
                    @change="emitTimeSignatureChange">
                    <option v-for="value in beatUnitValues" :key="value" :value="value">{{ value }}</option>
                </select>
            </div>
            <div class="collapse collapse-arrow bg-base-100 border border-base-300 w-full">
                <input type="checkbox" class="p-0 m-0 h-0"/>
                <div class="collapse-title font-medium">
                    Settings
                </div>
                <div class="collapse-content">
                    <div class="flex justify-between w-full">
                        <label class="label">
                            <span class="label-text">Beats per Subdivision</span>
                        </label>
                        <select class="select select-bordered" v-model="beatsPerSubdivision">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    
                    <div class="form-control mt-3">
                        <label class="cursor-pointer label">
                            <span class="label-text">Add Count-in Bar</span>
                            <input type="checkbox" class="checkbox checkbox-primary" v-model="countInBar" @change="emitTimeSignatureChange"/>
                        </label>
                    </div>
                </div>
            </div>
        </template>
        <template #tab2>
            <div class="flex flex-col justify-between mt-4 items-center">
                <textarea type="text"
                    class="input border-2 dark:border-gray-900 border-gray-100 text-xl w-full h-28 text-center dark:focus:bg-gray-900 focus:bg-gray-200"
                    v-model="inputString" placeholder="Enter a time signature string (eg. 4/4 & 3/8 )"></textarea>
                <div class="grid mt-2 mb-2">
                    <a v-for="denum in [4, 8]" :key=denum>
                        <button v-for="num in [ 3, 4, 5, 6, 7]" :key=num :id="`${num}/${denum}`"
                            @click="AddTimeSig(`${num}/${denum}`)" class="btn btn-xs btn-primary m-1">{{ num }}/{{ denum
                            }}</button>
                    </a>
                </div>
            </div>
            <div class="flex w-full justify-evenly">
                <button class="btn btn-outline btn-primary" @click="emitInputStringChange">Submit</button>
                <button class="btn btn-outline btn-secondary" @click="inputString = ''">Clear</button>
                <button class="btn btn-grey" onclick="help_modal.showModal()">Help</button>
            </div>
            <!-- Open the modal using ID.showModal() method -->
            <dialog id="help_modal" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Multiple Time Signatures</h3>
                    <ul class="mt-4 ml-4 list-disc">
                        <li>Input Time signatures by clicking the provided buttons</li>
                        <li>Manually Time Signature values in the textbox, separated '&' </li>
                        <li> <span>If you want multiple bars of the same time signature, you can enclose the value in
                                brackets and multiply by the desired number of bars <i>(Eg. (2/4)*2)</i></span></li>
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
    </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { numBeatValues, beatUnitValues } from '../constants';
import BaseCard from './BaseCard.vue';

const emits = defineEmits(["timeSignatureChange", "multipleTimeSignatureSubmit"]);
const numBeats = ref(4);
const beatUnit = ref(4);
const inputString = ref("");
const beatsPerSubdivision = ref(1);
const countInBar = ref(false);

const emitTimeSignatureChange = () => {
    if(countInBar.value) {
        emits("timeSignatureChange", ` ci(${numBeats.value}/${beatUnit.value}) & ${numBeats.value}/${beatUnit.value}`);
    } else {
        emits("timeSignatureChange", `${numBeats.value}/${beatUnit.value}`);
    }
};

const emitInputStringChange = () => {
    emits("multipleTimeSignatureSubmit", inputString.value);
};

function handleTabChange(tab: string) {
    if (tab === "tab-1") {
        emitTimeSignatureChange();
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

<style scoped>
/* Change here is necessary because text-align-center does not work with safari */
select {
    text-align-last: center;
}
</style>