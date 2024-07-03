<template>
  <div>
    <Transition name="fade-slide">
      <div v-if="intro" class="hero min-h-screen">
        <div class="hero-content text-center">
          <div class="max-w">
            <h1 class="text-8xl font-mono">Welcome to <h1 class = "font-italic [&::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
              GrooveTrainer </h1></h1>
            <p class="py-6 text-xl font-mono">
              The metronome you never knew you needed
            </p>
            <button @click="goToMetronome" class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">

import {ref , onMounted} from 'vue';

const intro: Ref<boolean> = ref(false);

onMounted(() => {
  window.setTimeout(() => {
    intro.value = true;
  }, 1000);
});


function goToMetronome() {
  intro.value = false;
  window.setTimeout(() => {
    window.location.href = '/metronome';
  }, 500);
}
</script>
