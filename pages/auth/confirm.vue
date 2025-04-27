<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="loading loading-spinner loading-lg mb-4"></div>
      <h2 class="text-2xl font-bold font-orbitron">Completing Authentication...</h2>
      <p class="mt-2">Please wait while we verify your credentials.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { useAuth } from '~/composables/useAuth';  

defineOptions({
  name: 'CallbackPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

const { user } = useAuth();
const router = useRouter();

// Watch for user authentication and redirect when logged in
watch(user, (user) => {
  if (user) {
    // Redirect to metronome if authenticated
    router.push('/metronome');
  }
}, { immediate: true });
</script> 