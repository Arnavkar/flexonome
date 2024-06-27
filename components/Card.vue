<template>
      <div v-if="isTabbed" class = "shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2" :class="cardSize">
        <div role="tablist" class="tabs tabs-boxed">
            <a role="tab" class="tab" @click="switchToSingleTab" :class="{'tab-active': activeTab === 'single'}">Single</a>
            <a role="tab" class="tab" @click="switchToMultipleTab" :class="{'tab-active': activeTab === 'multiple'}">Multiple</a>
        </div> 
        <div class="flex flex-col justify-center items-center p-4">
        <div v-show="activeTab === 'single'">
            <slot name="single"></slot>
        </div>
        <div v-show="activeTab === 'multiple'">
            <slot name="multiple"></slot>
        </div>
        </div>
    </div>
      <div v-else class="flex flex-col justify-center items-center shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2" :class="cardSize">
        <slot></slot>
      </div>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue';

// Define props
const props = defineProps({ 
    isTabbed: Boolean,
    size: {
        type: Number,
        default: 80
    }
});

// Active tab state
const activeTab:Ref<String> = ref('single');

function switchToSingleTab(){
    activeTab.value = 'single'
}

function switchToMultipleTab(){
    activeTab.value = 'multiple' 
}

const cardSize = computed(() => {
    return `w-${props.size} h-${props.size}`;
});

</script>
