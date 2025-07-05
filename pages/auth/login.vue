<template>
  <div class="min-h-dvh w-10/12 flex items-center justify-center">
    <div class="max-w-md w-full bg-base-200 shadow-lg rounded-lg p-8">   
      <h2 class="text-2xl font-bold text-center mb-6 font-orbitron">
        {{ currentMode === 'signin' ? 'Sign In to Flexonome' : 
           currentMode === 'signup' ? 'Create Account' : 'Reset Password' }}
      </h2>   
      
      <!-- Sign In / Sign Up Form -->
      <div v-if="currentMode !== 'reset'" class="mb-8">
        <div class="form-control mb-4">
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
        
        <div class="form-control mb-4">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="input input-bordered w-full"
            :class="{'input-error': passwordError}"
          />
          <label v-if="passwordError" class="label">
            <span class="label-text-alt text-error">{{ passwordError }}</span>
          </label>
        </div>
        
        <div v-if="currentMode === 'signup'" class="form-control mb-4">
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="input input-bordered w-full"
            :class="{'input-error': confirmPasswordError}"
          />
          <label v-if="confirmPasswordError" class="label">
            <span class="label-text-alt text-error">{{ confirmPasswordError }}</span>
          </label>
        </div>
        
        <button 
          @click="handleEmailAuth" 
          class="btn btn-primary w-full mb-4"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
          {{ currentMode === 'signin' ? 'Sign In' : 'Create Account' }}
        </button>
        
        <div v-if="currentMode === 'signin'" class="text-center mb-4">
          <button 
            @click="currentMode = 'reset'" 
            class="link link-primary text-sm"
          >
            Forgot your password?
          </button>
        </div>
      </div>
      
      <!-- Reset Password Form -->
      <div v-if="currentMode === 'reset'" class="mb-8">
        <p class="text-sm text-base-content/70 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <div class="form-control mb-4">
          <input
            v-model="resetEmail"
            type="email"
            placeholder="your@email.com"
            class="input input-bordered w-full"
            :class="{'input-error': resetEmailError}"
          />
          <label v-if="resetEmailError" class="label">
            <span class="label-text-alt text-error">{{ resetEmailError }}</span>
          </label>
        </div>
        
        <button 
          @click="handlePasswordReset" 
          class="btn btn-primary w-full mb-4"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
          Send Reset Link
        </button>
      </div>
      
      <!-- Divider -->
      <div v-if="currentMode !== 'reset'" class="divider">OR</div>
      
      <!-- OAuth Providers -->
      <div v-if="currentMode !== 'reset'" class="flex flex-col gap-4 mb-6">
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
      </div>
      
      <!-- Mode Toggle -->
      <div class="text-center">
        <div v-if="currentMode === 'signin'">
          <span class="text-sm text-base-content/70">Don't have an account? </span>
          <button @click="switchMode('signup')" class="link link-primary text-sm">
            Sign up
          </button>
        </div>
        <div v-else-if="currentMode === 'signup'">
          <span class="text-sm text-base-content/70">Already have an account? </span>
          <button @click="switchMode('signin')" class="link link-primary text-sm">
            Sign in
          </button>
        </div>
        <div v-else>
          <button @click="switchMode('signin')" class="link link-primary text-sm">
            Back to sign in
          </button>
        </div>
      </div>
      
      <!-- Messages -->
      <div v-if="error" class="mt-4 text-error text-center text-sm">{{ error }}</div>
      <div v-if="successMessage" class="mt-4 text-success text-center text-sm">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '#imports';

defineOptions({
  name: 'AuthPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

const { signUpWithEmail, signInWithEmail, signInWithOAuth, resetPassword } = useAuth();

// Form state
const currentMode = ref<'signin' | 'signup' | 'reset'>('signin');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const resetEmail = ref('');

// Error states
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const resetEmailError = ref('');
const error = ref('');
const successMessage = ref('');

// Loading state
const loading = ref(false);

// Validation functions
const validateEmail = (emailValue: string) => {
  if (!emailValue) {
    return 'Email is required';
  }
  if (!emailValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return 'Please enter a valid email address';
  }
  return '';
};

const validatePassword = (passwordValue: string) => {
  if (!passwordValue) {
    return 'Password is required';
  }
  if (passwordValue.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return '';
};

const validateConfirmPassword = (passwordValue: string, confirmValue: string) => {
  if (!confirmValue) {
    return 'Please confirm your password';
  }
  if (passwordValue !== confirmValue) {
    return 'Passwords do not match';
  }
  return '';
};

// Clear all errors and messages
const clearMessages = () => {
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  resetEmailError.value = '';
  error.value = '';
  successMessage.value = '';
};

// Switch between modes
const switchMode = (mode: 'signin' | 'signup' | 'reset') => {
  currentMode.value = mode;
  clearMessages();
  
  // Clear form fields when switching modes
  if (mode === 'reset') {
    resetEmail.value = email.value;
  }
};

// Handle email/password authentication
const handleEmailAuth = async () => {
  clearMessages();
  loading.value = true;
  
  try {
    // Validate inputs
    emailError.value = validateEmail(email.value);
    passwordError.value = validatePassword(password.value);
    
    if (currentMode.value === 'signup') {
      confirmPasswordError.value = validateConfirmPassword(password.value, confirmPassword.value);
    }
    
    // Stop if validation failed
    if (emailError.value || passwordError.value || confirmPasswordError.value) {
      return;
    }
    
    let result;
    if (currentMode.value === 'signin') {
      result = await signInWithEmail(email.value, password.value);
    } else {
      result = await signUpWithEmail(email.value, password.value);
    }
    
         if (result.success) {
       if (currentMode.value === 'signup') {
         successMessage.value = 'Account created! Please check your email to verify your account.';
       } else {
         // Redirect will happen automatically via auth state change
         successMessage.value = 'Successfully signed in! Redirecting...';
       }
     } else {
      error.value = result.error || 'An error occurred. Please try again.';
    }
  } catch (err) {
    console.error('Auth error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle password reset
const handlePasswordReset = async () => {
  clearMessages();
  loading.value = true;
  
  try {
    resetEmailError.value = validateEmail(resetEmail.value);
    
    if (resetEmailError.value) {
      return;
    }
    
    const result = await resetPassword(resetEmail.value);
    
    if (result.success) {
      successMessage.value = 'Password reset link sent! Check your email.';
      // Switch back to signin mode after a delay
      setTimeout(() => {
        switchMode('signin');
      }, 3000);
    } else {
      error.value = result.error || 'Failed to send reset email. Please try again.';
    }
  } catch (err) {
    console.error('Reset error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle Google sign in
const handleGoogleSignIn = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const result = await signInWithOAuth('google');
    
    if (!result.success) {
      error.value = result.error || 'Failed to sign in with Google. Please try again.';
    }
  } catch (err) {
    console.error('Google sign in error:', err);
    error.value = 'Failed to sign in with Google. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script> 