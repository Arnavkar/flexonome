<!-- INTRO PAGE -->
<template>
  <div>
    <!-- <Transition name="fade-slide"> -->
      <div v-if="intro" class="hero min-h-screen">
        <div class="hero-content text-center flex flex-col items-center">
          <div class="max-w mx-4">
            <FlexonomeTitle :auto-start="true" />
          </div>
        </div>
      </div>
    <!-- </Transition> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import FlexonomeTitle from '~/components/FlexonomeTitle.vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
defineOptions({
  name: 'IntroPage',
});

// eslint-disable-next-line
definePageMeta({
  layout: 'no-navigation'
});

const { user } = useAuth();
const intro: Ref<boolean> = ref(false);
const router = useRouter();

onMounted(() => {
  // If user is already authenticated, redirect to the app
  if (user.value) {
    router.push('/metronome');
    return;
  }
  
  // Otherwise show the intro
  window.setTimeout(() => {
    intro.value = true;
  }, 1000);
});
</script>