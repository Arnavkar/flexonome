<template>
      <div v-if="isTabbed" class = "shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2" :class="cardSize">
        <div role="tablist" class="tabs tabs-boxed">
            <a role="tab" class="tab" @click="switchToTab1" :class="{'tab-active': activeTab === 'tab-1'}">{{ firstTab}} </a>
            <a role="tab" class="tab" @click="switchToTab2" :class="{'tab-active': activeTab === 'tab-2'}">{{ secondTab }}</a>
        </div> 
        <div class="flex flex-col items-center">
            <SlideTransition>
                <div v-if="activeTab === 'tab-1'">
                    <slot name="single"></slot> 
                </div>
                <div v-else-if="activeTab === 'tab-2'">
                    <slot name="multiple"></slot> 
                </div>
            </SlideTransition>
        </div>
    </div>
      <div v-else class="flex flex-col justify-center items-center shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2" :class="cardSize">
        <slot></slot>
      </div>
  </template>
  
<script setup lang="ts">
import { ref, computed } from 'vue';
import SlideTransition from './SlideTransition.vue';

// Define props
const props = defineProps({ 
    isTabbed: Boolean,
    size: {
        type: Number,
        default: 80
    },
    firstTab: {
        type: String,
        required: false,
        default: 'Single'
    },
    secondTab: {
        type: String,
        required: false,
        default: 'Multiple'
    },
});

// Active tab state
const activeTab:ref<string> = ref('tab-1');
const emits = defineEmits(["activeTab"]);

function switchToTab1(){
    activeTab.value = 'tab-1'
    emitActiveTab();
}

function switchToTab2(){
    activeTab.value = 'tab-2' 
    emitActiveTab();
}

const cardSize = computed(() => {
    return `w-${props.size} h-${props.size}`;
});

const emitActiveTab = () => {
    emits('activeTab', activeTab.value);
}

</script>