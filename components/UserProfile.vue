<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img :src="avatarUrl" alt="User Avatar" />
      </div>
    </div>
    <ul tabindex="0" class="mt-3 z-10 p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
      <li class="p-2 text-center">
        <p class="font-semibold">{{ userEmail }}</p>
      </li>
      <li><a @click="signOut" class="flex items-center">
        <span v-if="auth.loading" class="loading loading-spinner loading-xs mr-2"></span>
        Logout
      </a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '~/composables/useAuth';

defineOptions({
  name: 'UserProfile'
});

const auth = useAuth();

// Default avatar
const avatarUrl = computed(() => {
  return auth.user.value?.user_metadata?.avatar_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.value)}&background=random`;
});

// Get user email
const userEmail = computed(() => {
  return auth.user.value?.email || 'User';
});

const signOut = async () => {
  await auth.signOut();
};
</script> 