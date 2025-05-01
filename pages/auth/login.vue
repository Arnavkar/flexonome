<template>
  <div class="min-h-dvh w-10/12 flex items-center justify-center">
    <div class="max-w-md w-full bg-base-200 shadow-lg rounded-lg p-8">   
      <h2 class="text-2xl font-bold text-center mb-6 font-orbitron">Sign In to Flexonome</h2>   
      <!-- Email Sign In -->
      <div class="mb-8">
        <div class="form-control">
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
          <IconWand/> Sign In with Magic Link <IconWand/>
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="width: 24px; height: 24px; margin-right: 8px;">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>
        
        <!-- <button 
          @click="handleFacebookSignIn" 
          class="btn btn-outline"
          :disabled="loading"
        >
          <i class="fab fa-facebook-f mr-2"></i> Continue with Facebook
        </button> -->
      </div>
      
      <p v-if="error" class="mt-4 text-error text-center">{{ error }}</p>
      <p v-if="emailSent" class="mt-4 text-success text-center">Check your email for the login link!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSupabaseClient } from '#imports';

defineOptions({
  name: 'AuthPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

const supabase = useSupabaseClient();
const email = ref('');
const emailError = ref('');
const emailSent = ref(false);
const loading = ref(false);
const error = ref('');

const handleEmailSignIn = async () => {
  // Reset states
  emailError.value = '';
  emailSent.value = false;
  error.value = '';
  loading.value = true;
  
  try {
    // Validate email
    if (!email.value) {
      emailError.value = 'Email is required';
      return;
    }
    
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailError.value = 'Please enter a valid email address';
      return;
    }
    
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (signInError) throw signInError;
    
    emailSent.value = true;
  } catch (err) {
    console.error('Sign in error:', err);
    error.value = 'Failed to send magic link. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (signInError) throw signInError;
  } catch (err) {
    console.error('Google sign in error:', err);
    error.value = 'Failed to sign in with Google. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script> 