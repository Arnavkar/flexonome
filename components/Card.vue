<template>
    <div class="flex justify-center items-center 
    shadow-md shadow-gray-500 dark:shadow-gray-700 
    border-gray-500 dark:border-gray-700 border-0 dark:border-2 
    rounded-xl p-4 w-72 h-72">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
export default defineComponent({
    name: 'Card',
  });
</script>