<template>
    <label class="flex cursor-pointer gap-2">
      <IconMoon class="w-5 h-5"/>
      <input 
      type="checkbox" 
      class="toggle" 
      v-model="isDarkTheme"
      @change="toggleTheme" 
    />
      <IconSun class="w-5 h-5"/>
    </label>
</template>


<script setup lang="ts">
import { themes } from '../constants';
import { useTheme } from '../composables/useTheme';
import { computed } from 'vue';

const { currentTheme, toggleTheme } = useTheme();
const isDarkTheme = computed(() => currentTheme.value === themes[1]);
</script>