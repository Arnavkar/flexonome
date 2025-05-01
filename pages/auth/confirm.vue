<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div v-if="!error" class="loading loading-spinner loading-lg mb-4"></div>
      <h2 class="text-2xl font-bold font-orbitron">{{ statusMessage }}</h2>
      <p v-if="error" class="mt-2 text-error">{{ error }}</p>
      <p v-else class="mt-2">Please wait while we verify your credentials.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSupabaseUser } from '#imports';

defineOptions({
  name: 'CallbackPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

const router = useRouter()
const user = useSupabaseUser()
const statusMessage = ref('Authenticating...')
const error = ref('')

watch(user, () => {
  if (user.value) {
    statusMessage.value = 'Authentication successful'!
    router.push('/metronome')
  } else {
    error.value = 'Authentication failed'
  }
}, { immediate: true })
</script>
