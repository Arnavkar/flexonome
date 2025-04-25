<template>
      <div v-if="isTabbed" class = "shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2" :class="BaseCardSize">
        <div role="tablist" class="tabs tabs-boxed">
            <a role="tab" class="tab" @click="switchToTab1" :class="{'tab-active': activeTab === 'tab-1'}">{{ firstTab}} </a>
            <a role="tab" class="tab" @click="switchToTab2" :class="{'tab-active': activeTab === 'tab-2'}">{{ secondTab }}</a>
        </div> 
        <div class="flex flex-col items-center">
            <SlideTransition>
                <div class="w-full flex flex-col items-center justify-center" v-if="activeTab === 'tab-1'">
                    <slot name="tab1"></slot> 
                </div>
                <div class="w-full flex flex-col items-center justify-center" v-else-if="activeTab === 'tab-2'">
                    <slot name="tab2"></slot> 
                </div>
            </SlideTransition>
        </div>
    </div>
      <div v-else class="flex flex-col justify-center items-center shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2" :class="BaseCardSize">
        <slot></slot>
      </div>
  </template>
  
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import SlideTransition from './SlideTransition.vue';

// Define props
const props = defineProps({ 
    isTabbed: Boolean,
    size: {
        type: String,
        default: '80'
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
const activeTab:Ref<string> = ref('tab-1');
const emits = defineEmits(["activeTab"]);

function switchToTab1(){
    activeTab.value = 'tab-1'
    emitActiveTab();
}

function switchToTab2(){
    activeTab.value = 'tab-2' 
    emitActiveTab();
}

const BaseCardSize = computed(() => {
    return `w-${props.size} h-${props.size}`;
});

const emitActiveTab = () => {
    emits('activeTab', activeTab.value);
}

</script>