<template>
    <div class="drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <!-- Page content here -->
            <div class="navbar bg-base-100">
                <div class="navbar-start">
                    <label for="my-drawer" class="btn btn-ghost btn-circle">
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
                    </label>
                </div>
                <div class="navbar-center">
                    <h1 class="title-gradient font-orbitron">
                        <a href="/">Flexonome </a></h1>
                </div>
                <div class="navbar-end">
                    <ThemeController />
                </div>
            </div>
        </div>
        <NavDrawer />
    </div>
</template>

<script setup lang="ts">
import ThemeController from './ThemeController.vue';
import NavDrawer from './NavDrawer.vue';
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