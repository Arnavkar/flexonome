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
          @click="signInWithEmail" 
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
          @click="signInWithGoogle" 
          class="btn btn-outline"
          :disabled="loading"
        >
          <i class="fab fa-google mr-2"></i> Continue with Google
        </button>
        
        <button 
          @click="signInWithFacebook" 
          class="btn btn-outline"
          :disabled="loading"
        >
          <i class="fab fa-facebook-f mr-2"></i> Continue with Facebook
        </button>
      </div>
      
      <p v-if="errorMessage" class="mt-4 text-error text-center">{{ errorMessage }}</p>
      <p v-if="emailSent" class="mt-4 text-success text-center">Check your email for the login link!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'LoginAuthPage'
});

const supabase = useSupabaseClient();
const email = ref('');
const loading = ref(false);
const emailError = ref('');
const errorMessage = ref('');
const emailSent = ref(false);

const signInWithEmail = async () => {
  // Reset states
  emailError.value = '';
  errorMessage.value = '';
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
  
  try {
    loading.value = true;
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      }
    });
    
    if (error) throw error;
    
    emailSent.value = true;
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred during sign in';
    console.error('Error signing in:', error);
  } finally {
    loading.value = false;
  }
};

const signInWithGoogle = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
      }
    });
    
    if (error) throw error;
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred during sign in';
    console.error('Error signing in with Google:', error);
    loading.value = false;
  }
};

const signInWithFacebook = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
      }
    });
    
    if (error) throw error;
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred during sign in';
    console.error('Error signing in with Facebook:', error);
    loading.value = false;
  }
};
</script> 