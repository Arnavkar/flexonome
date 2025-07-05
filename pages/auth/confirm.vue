<template>
  <div class="min-h-dvh w-10/12 flex items-center justify-center">
    <div class="max-w-md w-full bg-base-200 shadow-lg rounded-lg p-8">
      <h2 class="text-2xl font-bold text-center mb-6 font-orbitron">
        {{ isPasswordReset ? 'Reset Your Password' : 'Confirm Your Account' }}
      </h2>
      
      <!-- Password Reset Form -->
      <div v-if="isPasswordReset && !isConfirmed" class="mb-8">
        <div class="form-control mb-4">
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            class="input input-bordered w-full"
            :class="{'input-error': passwordError}"
          />
          <label v-if="passwordError" class="label">
            <span class="label-text-alt text-error">{{ passwordError }}</span>
          </label>
        </div>
        
        <div class="form-control mb-4">
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            class="input input-bordered w-full"
            :class="{'input-error': confirmPasswordError}"
          />
          <label v-if="confirmPasswordError" class="label">
            <span class="label-text-alt text-error">{{ confirmPasswordError }}</span>
          </label>
        </div>
        
        <button 
          @click="handlePasswordUpdate" 
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
          Update Password
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-else-if="loading" class="text-center">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="mt-4 text-base-content/70">
          {{ isPasswordReset ? 'Verifying reset link...' : 'Confirming your account...' }}
        </p>
      </div>
      
      <!-- Success State -->
      <div v-else-if="isConfirmed" class="text-center">
        <div class="text-success text-6xl mb-4">✓</div>
        <h3 class="text-xl font-semibold mb-2">
          {{ isPasswordReset ? 'Password Updated!' : 'Account Confirmed!' }}
        </h3>
        <p class="text-base-content/70 mb-6">
          {{ isPasswordReset ? 'Your password has been successfully updated.' : 'Your account has been confirmed and you can now sign in.' }}
        </p>
        <button 
          @click="goToLogin" 
          class="btn btn-primary"
        >
          {{ isPasswordReset ? 'Sign In' : 'Continue to App' }}
        </button>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <div class="text-error text-6xl mb-4">✗</div>
        <h3 class="text-xl font-semibold mb-2">Confirmation Failed</h3>
        <p class="text-error mb-6">{{ error }}</p>
        <button 
          @click="goToLogin" 
          class="btn btn-outline"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth, useRoute, useSupabaseClient } from '#imports';

defineOptions({
  name: 'ConfirmPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

const { updatePassword } = useAuth();
const route = useRoute();
const supabase = useSupabaseClient();

// State
const loading = ref(true);
const error = ref('');
const isConfirmed = ref(false);
const isPasswordReset = ref(false);

// Password reset form
const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// Validation
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

// Handle password update
const handlePasswordUpdate = async () => {
  passwordError.value = '';
  confirmPasswordError.value = '';
  loading.value = true;
  
  try {
    // Validate inputs
    passwordError.value = validatePassword(newPassword.value);
    confirmPasswordError.value = validateConfirmPassword(newPassword.value, confirmPassword.value);
    
    if (passwordError.value || confirmPasswordError.value) {
      loading.value = false;
      return;
    }
    
    const result = await updatePassword(newPassword.value);
    
    if (result.success) {
      isConfirmed.value = true;
    } else {
      error.value = result.error || 'Failed to update password. Please try again.';
    }
  } catch (err) {
    console.error('Password update error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Navigate to login or home
const goToLogin = () => {
  if (isPasswordReset.value || error.value) {
    window.location.href = '/auth/login';
  } else {
    window.location.href = '/';
  }
};

// Handle auth confirmation on mount
onMounted(async () => {
  try {
    const { data, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth error:', authError);
      error.value = 'Invalid or expired confirmation link.';
      loading.value = false;
      return;
    }
    
    // Check if this is a password reset flow
    const type = route.query.type as string;
    if (type === 'recovery') {
      isPasswordReset.value = true;
      loading.value = false;
      return;
    }
    
    // For email confirmation, redirect to app if already authenticated
    if (data.session) {
      isConfirmed.value = true;
      loading.value = false;
      // Auto-redirect after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      // Handle email confirmation
      const accessToken = route.query.access_token as string;
      const refreshToken = route.query.refresh_token as string;
      
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          error.value = 'Invalid or expired confirmation link.';
        } else {
          isConfirmed.value = true;
          // Auto-redirect after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        error.value = 'Invalid confirmation link.';
      }
      
      loading.value = false;
    }
  } catch (err) {
    console.error('Confirmation error:', err);
    error.value = 'An unexpected error occurred during confirmation.';
    loading.value = false;
  }
});
</script>
