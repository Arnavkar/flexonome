<template>
  <div class="relative flex flex-col justify-center items-center">
    <slot />
    <NuxtSnackbar />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'no-navigation'
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
</style> 