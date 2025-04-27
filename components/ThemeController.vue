<template>
    <label class="flex cursor-pointer gap-2">
     <IconMoon/>
    <input 
      type="checkbox" 
      class="toggle" 
      v-model="isDarkTheme"
      @change="toggleTheme" 
    />
    <IconSun/>
    </label>
</template>

<script setup lang="ts">
import { themes } from '../constants';
import { useTheme } from '../composables/useTheme';
import { computed } from 'vue';

const { currentTheme, toggleTheme } = useTheme();
const isDarkTheme = computed(() => currentTheme.value === themes[1]);
</script>