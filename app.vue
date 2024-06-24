<template>
  <div class="relative flex justify-center items-center h-screen">
    <div class="absolute top-0 right-0 m-4 p-2">
      <label class="swap swap-flip">
        <input type="checkbox" class="toggle" @click="toggleTheme" />
      </label>
    </div>
    <Transition name="fade-slide">
      <div v-if="intro" class="hero min-h-screen">
        <div class="hero-content text-center">
          <div class="max-w">
            <h1 class="text-8xl font-mono">Welcome to <h1 class = "font-italic [&::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
              GrooveTrainer </h1></h1>
            <p class="py-6 text-xl font-mono">
              The metronome you never knew you needed
            </p>
            <button @click="startMetronome" class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade-slide">
      <div v-if="showMetronome">
        <Metronome />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { themes } from './constants';
import { onMounted, ref} from 'vue';
import Metronome from './components/Metronome.vue';

const intro: Ref<boolean> = ref(false);
const showMetronome: Ref<boolean> = ref(false);

function startMetronome() {
  intro.value = false;
  window.setTimeout(() => {
    showMetronome.value = true;
  }, 500);
}

function toggleTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  setTheme(theme === themes[0] ? themes[1] : themes[0]);
}

function setTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
}

onMounted(() => {
  setTheme(themes[0]);
  window.setTimeout(() => {
    intro.value = true;
  }, 1000);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
