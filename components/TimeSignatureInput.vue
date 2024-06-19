<template>
    <Card>
        <div class="flex flex-col w-12 items-center">
            <input 
                type="number" 
                class="input input-ghost text-5xl focus:text-primary text-center w-20 h-20" 
                v-model.number="numBeats" 
                @input="emitNumBeatsChange"
            >            
            <div class="divider divider-primary mt-0 mb-0"></div>
            <input 
                type="number" 
                class="input input-ghost text-5xl focus:text-primary text-center w-20 h-20" 
                v-model.number="beatUnit" 
                @input="emitBeatValueChange"
            >       
        </div>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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