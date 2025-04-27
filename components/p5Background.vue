<template>
    <div ref="p5Container" class="fixed top-0 left-0 w-full h-full -z-10 opacity-0"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { gsap } from 'gsap';
  
  // Add p5 to the window object type
  declare global {
    interface Window {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p5: any;
    }
  }
  
  const p5Container = ref<HTMLElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let p5Instance: any;
  
  const initP5 = () => {
    if (typeof window !== 'undefined' && p5Container.value && typeof window.p5 !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sketch = (p: any) => {
        const ranges = 100;
        
        p.setup = () => {
          p.createCanvas(window.innerWidth, window.innerHeight);
          p.background(16,23,42);
        };
  
        p.draw = () => {
          p.background(16,23,42);
          p.noFill();
          p.strokeWeight(2);
  
          for (let i = 0; i < ranges; i++) {
            const r = p.map(i, 0, ranges, 16, 46);
            const g = p.map(i, 0, ranges, 23, 164);
            const b = p.map(i, 0, ranges, 42, 216);
            p.stroke(r, g, b);
            
            p.beginShape();
            for (let x = -10; x < p.width + 11; x += 20) {
              const n = p.noise(x * 0.001, i * 0.01, p.frameCount * 0.0008);
              const y = p.map(n, 0, 1, 0, p.height)+300;
              p.vertex(x, y);
            }
            p.endShape();
          }
        };
  
        p.windowResized = () => {
          p.resizeCanvas(window.innerWidth, window.innerHeight);
        };
      };
  
      // Use the global p5 object from CDN
      p5Instance = new window.p5(sketch, p5Container.value);
    }
  };
  
  const fadeIn = () => {
    if (p5Container.value) {
      gsap.to(p5Container.value, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      });
    }
  };
  
  onMounted(() => {
    // Load p5.min.js from CDN
    const p5Script = document.createElement('script');
    p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/p5.min.js';
    p5Script.onload = () => {
      // Initialize p5 after the script has loaded
      initP5();
    };
    document.head.appendChild(p5Script);
  });
  
  onUnmounted(() => {
    if (p5Instance) {
      p5Instance.remove();
    }
  });
  
  defineExpose({
    fadeIn
  });
  </script>
  
  <style scoped>
  div {
    pointer-events: none;
  }
  </style>