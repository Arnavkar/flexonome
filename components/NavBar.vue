<template>
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                </div>
                <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li><NuxtLink to="/metronome" @click="closeDropdown">Metronome</NuxtLink></li>
                <li><NuxtLink to="/polyrhythm" @click="closeDropdown">Polyrhythm</NuxtLink></li>
                <li><NuxtLink to="/phaser" @click="closeDropdown">Phaser</NuxtLink></li>
                </ul>
            </div>
        </div>
        <div class="navbar-center">
            <h1 class = "font-orbitron [&::selection]:text-base-content bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                <a href="/">Flexonome </a></h1>
        </div>
        <div class="navbar-end gap-7">
            <a 
                href="https://tally.so/r/wLopVl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn btn-sm feedback-btn sparkle-btn relative group"
            >
                <span class="relative z-10">Submit Feedback</span>
            </a>
            <ThemeController />
            <UserProfile v-if="user" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ThemeController from './ThemeController.vue';
import UserProfile from './UserProfile.vue';
import { useCurrentUser } from '~/composables/useCurrentUser';

// Get the current user
const { user } = useCurrentUser();

const closeDropdown = () => {
    const dropdown = document.querySelector('.menu') as HTMLElement;
    if (dropdown) dropdown.blur();
};
</script>

<style scoped>
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

.feedback-btn:hover{
  opacity: 1;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(-3px, -2px) rotate(-5deg); }
  50% { transform: translate(1px, -4px) rotate(5deg); }
  75% { transform: translate(2px, -1px) rotate(-3deg); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(3px, 1px) rotate(5deg); }
  50% { transform: translate(1px, 3px) rotate(-5deg); }
  75% { transform: translate(-2px, 2px) rotate(3deg); }
}

.animate-float1 {
  animation: float1 2s ease-in-out infinite;
}

.animate-float2 {
  animation: float2 2.5s ease-in-out infinite;
}
</style>