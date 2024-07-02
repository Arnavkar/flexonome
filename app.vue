<template>
    <div class="relative flex flex-col justify-center items-center h-screen">
        <div class="absolute top-0 w-full p-4">
            <NavBar />
        </div>
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';
import NavBar from '~/components/NavBar.vue';
//Check the current URL path


</script>