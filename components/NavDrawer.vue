<template>
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex flex-col justify-between min-h-full w-80 bg-base-200 text-base-content">
      <!-- Navigation Menu -->
      <ul class="menu p-4">
        <li>
          <NuxtLink to="/metronome" :class="{ 'active': isActive('/metronome') }" @click="closeDrawer">
            Metronome
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/polyrhythm" :class="{ 'active': isActive('/polyrhythm') }" @click="closeDrawer">
            Polyrhythm
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/phaser" :class="{ 'active': isActive('/phaser') }" @click="closeDrawer">
            Phaser
          </NuxtLink>
        </li>
      </ul>
      
      <!-- Footer with User Profile and Feedback Button -->
      <div class="p-4 border-t border-base-300">
        <!-- User Profile Section -->
        <div v-if="user" class="mb-4 p-2">
          <!-- Avatar and Email on one line -->
          <div class="flex items-center gap-3 mb-2">
            <div class="avatar">
              <div class="w-10 rounded-full">
                <img :src="avatarUrl" alt="User Avatar" />
              </div>
            </div>
            <p class="font-semibold truncate">{{ userEmail }}</p>
          </div>
          
          <!-- Logout button on second line -->
          <button @click="handleSignOut" class="btn btn-sm btn-ghost w-full justify-start mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        
        <!-- Feedback Button -->
        <a 
          href="https://tally.so/r/wLopVl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-sm w-full feedback-btn sparkle-btn relative group"
        >
          <span class="relative z-10">Submit Feedback</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';
defineOptions({
  name: 'NavDrawer'
});

const route = useRoute();
const router = useRouter();
const { user, signOut } = useAuth();

// Function to check if a path is active
const isActive = (path: string): boolean => {
  return route.path === path;
};

// Function to close the drawer
const closeDrawer = () => {
  const drawerToggle = document.getElementById('my-drawer') as HTMLInputElement;
  if (drawerToggle) {
    drawerToggle.checked = false;
  }
};

// Default avatar
const avatarUrl = computed(() => {
  if (!user.value) return 'https://ui-avatars.com/api/?name=User&background=random';
  
  return user.value.user_metadata?.avatar_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.value)}&background=random`;
});

// Get user email
const userEmail = computed(() => {
  return user.value?.email || 'User';
});

const handleSignOut = async () => {
  await signOut();
  closeDrawer(); // Close drawer after logout
  router.push('/auth/login');
};
</script>

<style scoped>
.active {
  background-color: hsl(var(--p) / 0.2);
  color: hsl(var(--pc));
}

.feedback-btn {
  background: linear-gradient(to right, #ff9a9e, #fad0c4);
  color: #333;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.feedback-btn:hover {
  transform: translateY(-2px);
}

.feedback-btn:active {
  transform: translateY(0);
}
</style> 