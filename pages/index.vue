<template>
  <div>
    <Transition name="fade-slide">
      <div v-if="intro" class="hero min-h-screen">
        <div class="hero-content text-center flex flex-col items-center">
          <div class="max-w mx-4">
            <!-- Adjusted font sizes for responsiveness -->
            <h1 class="text-3xl sm:text-5xl font-mono">
              Welcome to 
              <h1 
                class="font-italic [&::selection]:text-base-content relative
                bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] 
                bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 
                [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                GrooveTrainer
              </h1>
            </h1>
            <p class="py-3 sm:py-6 text-base sm:text-xl font-mono">
              The metronome you never knew you needed
            </p>
            <!-- Responsive button size -->
            <button @click="goToMetronome" class="btn btn-primary w-full sm:w-auto">Get Started</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';

const intro: Ref<boolean> = ref(false);

onMounted(() => {
  window.setTimeout(() => {
    intro.value = true;
  }, 1000);
});

const goToMetronome = () => {
  intro.value = false;
  setTimeout(() => {
    window.location.href = '/metronomeView';
  }, 500);
}
</script>
