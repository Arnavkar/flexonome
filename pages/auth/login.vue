<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-base-200 shadow-lg rounded-lg p-8">
      <h2 class="text-2xl font-bold text-center mb-6 font-orbitron">Sign In to Flexonome</h2>
      
      <!-- Email Sign In -->
      <div class="mb-8">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="input input-bordered w-full"
            :class="{'input-error': emailError}"
          />
          <label v-if="emailError" class="label">
            <span class="label-text-alt text-error">{{ emailError }}</span>
          </label>
        </div>
        
        <button 
          @click="handleEmailSignIn" 
          class="btn btn-primary w-full mt-4"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
          Sign in with Magic Link
        </button>
      </div>
      
      <!-- Divider -->
      <div class="divider">OR</div>
      
      <!-- OAuth Providers -->
      <div class="flex flex-col gap-4">
        <button 
          @click="handleGoogleSignIn" 
          class="btn btn-outline"
          :disabled="loading"
        >
          <i class="fab fa-google mr-2"></i> Continue with Google
        </button>
        
        <button 
          @click="handleFacebookSignIn" 
          class="btn btn-outline"
          :disabled="loading"
        >
          <i class="fab fa-facebook-f mr-2"></i> Continue with Facebook
        </button>
      </div>
      
      <p v-if="error" class="mt-4 text-error text-center">{{ error }}</p>
      <p v-if="emailSent" class="mt-4 text-success text-center">Check your email for the login link!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

defineOptions({
  name: 'AuthPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

const { signInWithEmail, signInWithOAuth, loading, error } = useAuth();
const email = ref('');
const emailError = ref('');
const emailSent = ref(false);

const handleEmailSignIn = async () => {
  // Reset states
  emailError.value = '';
  emailSent.value = false;
  
  // Validate email
  if (!email.value) {
    emailError.value = 'Email is required';
    return;
  }
  
  if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    emailError.value = 'Please enter a valid email address';
    return;
  }
  
  const redirectUrl = `${window.location.origin}/auth/confirm`;
  const { success } = await signInWithEmail(email.value, redirectUrl);
  
  if (success) {
    emailSent.value = true;
  }
};

const handleGoogleSignIn = async () => {
  const redirectUrl = `${window.location.origin}/auth/confirm`;
  await signInWithOAuth('google', redirectUrl);
};

const handleFacebookSignIn = async () => {
  const redirectUrl = `${window.location.origin}/auth/confirm`;
  await signInWithOAuth('facebook', redirectUrl);
};
</script> 