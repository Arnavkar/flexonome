<template>
    <div class="bouncing-bar-container">
      <div class="bouncing-bar"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
  
  // Define props
  const props = defineProps<{
    bpm: number;
  }>();
  
  // Ref to control the bar's animation
  const barPosition = ref('0%');
  
  // Function to start the animation
  const startAnimation = () => {
    barPosition.value = '100%';
    setTimeout(() => {
      barPosition.value = '0%';
    }, (60000 / props.bpm) * 2); // Time for one round trip
  };
  
  let animationInterval;
  
  // Watch effect to update animation based on BPM
  watch(() => (props.bpm), () =>{
    clearInterval(animationInterval);
    startAnimation();
    animationInterval = setInterval(startAnimation, (60000 / props.bpm) * 2);
  });
  
  onMounted(() => {
    startAnimation();
    animationInterval = setInterval(startAnimation, (60000 / props.bpm) * 2);
  });
  
  onUnmounted(() => {
    clearInterval(animationInterval);
  });
  </script>
  
  <style scoped>
  .bouncing-bar-container {
    position: relative;
    width: 100%;
    height: 50px;
    background-color: #f0f0f0;
    overflow: hidden;
  }
  
  .bouncing-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 10%;
    height: 100%;
    background-color: blue;
    transition: left linear;
    transition-duration: calc(var(--duration) * 1ms);
  }
  </style>
  