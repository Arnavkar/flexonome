<template>
    <Card :isTabbed="false">
        <div ref="dial" class="relative w-60 h-60 rounded-full border-4 border-gray-300 dark:border-gray-600 ">
            <div class="absolute inset-0 flex flex-col justify-center items-center">
                <div class="text-5xl font-bold">
                    {{ bpm }}
                </div>
                <div class="text-lg">
                    BPM (♩)
                </div>
            </div>
            <div class="absolute w-6 h-6 rounded-full cursor-pointer bg-gray-700 dark:bg-white" :style="knobStyle"
                @mousedown="startDrag">
            </div>
            <ul v-for="i in 12" :key="i">
                <div 
                class="absolute w-1 h-1 rounded-full cursor-pointer bg-gray-400 dark:bg-gray-300 disabled" 
                :style ="{
                    top: `calc(50% + ${118 * Math.sin((angle+i*30  * Math.PI ) / 180)}px)`,
                    left: `calc(50% + ${118 * Math.cos((angle+i*30  * Math.PI) / 180)}px)`,
                    transform: `translate(-50%, -50%) rotate(${angle+i}deg)`, 
                    transformOrigin: 'center center'
                    }"
                >
                </div>
            </ul>
        </div>
    </Card>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, watch, defineProps } from 'vue';
import Card from './Card.vue';

const props = defineProps({ 
    bpm: {
        type: Number,
        default: 120
    }
});
const emits = defineEmits(["updateBpm"]);

const angle:Ref<number> = ref(0);
const dragging:Ref<boolean>= ref(false);
const bpm:Ref<number> = ref(props.bpm);
const dial:Ref<HTMLElement|null> = ref(null);

function startDrag(event: MouseEvent){
    event.preventDefault(); //Prevents highlighting etc.
    dragging.value = true;
    //Once the drag has started
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
};

function onDrag(event: MouseEvent){
    if (!dragging.value || !dial.value) return; //Make sure dial is rendered and draggin is true
    const rect = dial.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;
    let newAngle = Math.atan2(y, x) * (180 / Math.PI);

    // Ensure the angle is within the allowable range
    if (newAngle < 0) newAngle += 360;

    const delta = newAngle - angle.value;
    angle.value = newAngle;

    // Update bpm based on angle change
    if (delta > 0) {
        bpm.value = Math.min(300, bpm.value + 1);
    } else if (delta < 0) {
        bpm.value = Math.max(20, bpm.value - 1);
    }
};

function stopDrag(){
    dragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
};

const knobStyle = computed(() => {
    const radius = 100; // Adjusted for the dial's radius
    const radians = ((angle.value * Math.PI) / 180);
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);
    return {
        top: `calc(50% + ${y}px)`,
        left: `calc(50% + ${x}px)`,
        transform: `translate(-50%, -50%) rotate(${angle.value}deg)`,
        transformOrigin: 'center center',
    };
});


onMounted(() => {
    document.addEventListener('mouseup', stopDrag);
});

onUnmounted(() => {
    document.removeEventListener('mouseup', stopDrag);
});

watch(bpm, (newBpm) => {
    emits('updateBpm', newBpm);
});
</script>

<style scoped>
/* Add any additional styles here */
</style>