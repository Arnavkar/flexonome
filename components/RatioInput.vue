<template>
    <BaseCard :isTabbed="false" :size="cardSize">
        <div class="flex items-center justify-center">
                <select :class="textSize" class="input input-ghost text-primary focus:text-primary" v-model.number="ratio_1" @change="emitRatio1Change">
                    <option v-for="value in 15" :key="value" :value="value">{{ value }}</option>
                </select>    
                <label :class="textSize" class="mx-2">:</label>
                <select :class="textSize" class="input input-ghost text-accent focus:text-accent" v-model.number="ratio_2" @change="emitRatio2Change">
                    <option v-for="value in 15" :key="value" :value="value">{{ value }}</option>
                </select>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseCard from './BaseCard.vue';

const props = defineProps({ 
    isMobile: {
        type: Boolean,
        default: false
    }
});

const cardSize = props.isMobile ? '24' : '80';
const textSize = props.isMobile ? "text-2xl p-0" : "text-5xl";

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

<style scoped>
/* Change here is necessary because text-align-center does not work with safari */
select {
    text-align-last: center;
}
</style>