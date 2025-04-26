<template>
  <div class="relative flex flex-col justify-center items-center min-h-screen">
    <div class="absolute top-4 left-4 z-50">
      <NuxtLink to="/" class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </NuxtLink>
    </div>
    <slot />
    <NuxtSnackbar />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AuthLayout'
});
</script>

<style>
/* Using the same transition styles as the default layout */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style> 