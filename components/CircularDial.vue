<template>
    <div class="flex justify-center items-center h-screen">
      <div ref="dial" class="relative w-48 h-48 rounded-full border-4 border-gray-300">
        <div class="absolute inset-0 flex justify-center items-center text-xl font-bold">
          {{ bpm }}
        </div>
        <div
          class="absolute w-6 h-6 bg-white rounded-full cursor-pointer"
          :style="knobStyle"
          @mousedown="startDrag"
        ></div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
  
  export default defineComponent({
    name: 'CircularDial',
    setup() {
      const angle = ref(0);
      const bpm = ref(60);
      const dragging = ref(false);
      const dial = ref<HTMLElement | null>(null);
  
      const startDrag = (event: MouseEvent) => {
        event.preventDefault();
        dragging.value = true;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
      };
  
      const onDrag = (event: MouseEvent) => {
        if (!dragging.value || !dial.value) return;
        const rect = dial.value.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = event.clientX - centerX;
        const y = event.clientY - centerY;
        let newAngle = Math.atan2(y, x) * (180 / Math.PI);
        
        // Ensure the angle is within the allowable range
        if (newAngle < 0) newAngle += 360;
  
        const delta = newAngle - angle.value;
        angle.value = newAngle;
  
        // Update bpm based on angle change
        if (delta > 0) {
          bpm.value = Math.min(400, bpm.value + 1);
        } else if (delta < 0) {
          bpm.value = Math.max(20, bpm.value - 1);
        }
      };
  
      const stopDrag = () => {
        dragging.value = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
      };
  
      const knobStyle = computed(() => {
        const radius = 96; // Adjusted for the dial's radius
        const radians = (angle.value * Math.PI) / 180;
        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);
        return {
          top: `calc(50% + ${y}px)`,
          left: `calc(50% + ${x}px)`,
          transform: `translate(-50%, -50%) rotate(${angle.value}deg)`,
          transformOrigin: 'center center',
        };
      });
  
      onMounted(() => {
        document.addEventListener('mouseup', stopDrag);
      });
  
      onUnmounted(() => {
        document.removeEventListener('mouseup', stopDrag);
      });
  
      return {
        dial,
        startDrag,
        knobStyle,
        bpm,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  