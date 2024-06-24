<template>
      <div v-if="isTabbed" class = "shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2 w-72 h-72">
        <div role="tablist" class="tabs tabs-boxed">
            <a role="tab" class="tab" @click="activeTab = 'single' ":class="{'tab-active': activeTab === 'single'}">Single</a>
            <a role="tab" class="tab" @click="activeTab = 'multiple' ":class="{'tab-active': activeTab === 'multiple'}">Multiple</a>
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
      <div v-else class="flex flex-col justify-center items-center shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2 w-72 h-72">
        <slot></slot>
      </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Define props
  const props = defineProps({ isTabbed: Boolean});
  
  // Active tab state
  const activeTab:Ref<String> = ref('single');
  </script>
  