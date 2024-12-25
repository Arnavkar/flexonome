<template>
    <BaseCard :isTabbed="false" :size="80">
        <div class="flex items-center justify-center">
            <span class="text-5xl">
                <select class="input input-ghost text-5xl text-primary focus:text-primary text-center w-24 h-20" v-model.number="ratio_1" @change="emitRatio1Change">
                    <option v-for="value in 15" :key="value" :value="value">{{ value }}</option>
                </select>  
                :   
                <select class="input input-ghost text-5xl text-accent focus:text-accent text-center w-24 h-20" v-model.number="ratio_2" @change="emitRatio2Change">
                    <option v-for="value in 15" :key="value" :value="value">{{ value }}</option>
                </select>
            </span>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseCard from './BaseCard.vue';

const emits = defineEmits(["ratio1Change", "ratio2Change"]);
const ratio_1 = ref(3);
const ratio_2 = ref(4);

const emitRatio1Change = () => {
    emits("ratio1Change", ratio_1.value);
};

const emitRatio2Change = () => {
    emits("ratio2Change", ratio_2.value);
};
</script>