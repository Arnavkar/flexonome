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
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import FlexonomeTitle from '~/components/FlexonomeTitle.vue';

defineOptions({
  name: 'IntroPage'
});

const intro: Ref<boolean> = ref(false);

onMounted(() => {
  window.setTimeout(() => {
    intro.value = true;
  }, 1000);
});
</script>