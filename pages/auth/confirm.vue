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
import { useCurrentUser } from '~/composables/useCurrentUser';

defineOptions({
  name: 'CallbackPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

// Use the new composable instead of direct Supabase user
const { isLoggedIn } = useCurrentUser();
const router = useRouter();

// Watch for user authentication and redirect when logged in
watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    // Redirect to metronome if authenticated
    router.push('/metronome');
  }
}, { immediate: true });
</script> 