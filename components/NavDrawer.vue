<template>
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex flex-col justify-between min-h-full w-80 bg-base-200 text-base-content">
      <!-- Navigation Menu -->
      <ul class="menu p-4 mt-4 text-lg font-montserrat">
        <li>
          <NuxtLink to="/metronome" :class="{ 'active': isActive('/metronome') }" @click="closeDrawer">
            <IconClock class="text-primary"/> <span>Metronome</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/polyrhythm" :class="{ 'active': isActive('/polyrhythm') }" @click="closeDrawer">
            <IconBlend class="text-secondary"/> <span>Polyrhythm</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/phaser" :class="{ 'active': isActive('/phaser') }" @click="closeDrawer">
            <IconAudioWaveform class="text-accent"/> <span>Phaser</span>
          </NuxtLink>
        </li>
      </ul>
      
      <!-- Footer with User Profile and Feedback Button -->
      <div class="p-4">
        <div class="divider"></div>
        <!-- User Profile Section -->
        <div v-if="user" class="p-2">
          <!-- Avatar and Email on one line -->
          <div class="flex items-center gap-2 ml-2 mb-2">
            <div class="avatar">
              <div class="w-10 rounded-full">
                <img :src="avatarUrl" alt="User Avatar" />
              </div>
            </div>
            <p class="font-semibold truncate">{{ userEmail }}</p>
          </div>
        </div>
        
        <!-- buttons -->
                  
        <button @click="handleSignOut" class="btn btn-sm w-full logout-btn relative group mb-2">
          <span class="relative flex items-center gap-2 z-10"> <IconLogOut :size="16"/> Logout</span>
        </button>
        <a 
          href="https://tally.so/r/wLopVl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-sm w-full feedback-btn relative group"
        >
          <span class="relative flex items-center gap-2 z-10"> <IconSend :size="16"/> Submit Feedback</span>
        </a>
        <a 
          href="https://tally.so/r/nGkP4O" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-sm w-full bug-btn relative group mt-2"
        >
          <span class="relative flex items-center gap-2 z-10"> <IconBug :size="16"/> Report Bug</span>
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

.bug-btn {
  background: linear-gradient(to right, #a855f7, #e9d5ff);
  color: #333;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  background: linear-gradient(to right, #60a5fa, #93c5fd);
  color: #333;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

a:hover {
  transform: translateY(-2px);
}

a:active {
  transform: translateY(0);
}
</style> 