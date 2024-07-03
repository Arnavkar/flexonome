<template>
    <div class="relative flex flex-col justify-center items-center h-screen">
        <div class="absolute top-0 w-full p-4">
            <NavBar v-if="!isIntro"/>
        </div>
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';
import NavBar from '~/components/NavBar.vue';
//Check the current URL path
const isIntro: Ref<boolean> = computed(() => {
    const route = useRoute().path;
    return route === '/';
});

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: relative;
}
</style>