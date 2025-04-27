<template>
  <div class="flexonome-title-container">
    <P5Background ref="particleRef" />
    <div class="chat-box">
      <div class="chat-content">
        <span ref="typingText" class="typing-text"></span>
        <span class="cursor">|</span>
        <button v-if="showSubmit" @click="handleSubmit"
          class="submit-btn btn btn-primary absolute -bottom-14 left-1/2 transform -translate-x-1/2 w-4 text-white ">
          Submit
        </button>
      </div>
    </div>
    <h1 class="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-orbitron">
      <div ref="titleRef" class="flexonome-animated-title">
        <span v-for="(letter, index) in 'FLEXONOME'" :key="index" :data-letter-index="index"
          :class="['inline-block', 'opacity-0', 'transform', 'translate-y-4', 'tracking-wider', isAccent(index) ? 'text-primary' : 'white']">
          {{ letter }}
        </span>
      </div>
    </h1>
    <div ref="contentRef" class="opacity-0 transform translate-y-4">
      <p class="py-3 sm:py-6 text-base sm:text-xl font-mono">
        The world's first programmable metronome
      </p>
      <!-- Responsive button size -->
      <button @click="goToMetronome" class="btn btn-soft btn-primary w-full sm:w-auto">Get Started</button>
    </div>
    <!-- Responsive button size -->
    <button @click="goToMetronome" class="absolute top-2 right-2 btn btn-neutral sm:w-auto">Skip</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import MetronomeV2 from '../core/MetronomeV2';
import gsap from 'gsap';
import P5Background from './p5Background.vue';

// Props and emits
const props = defineProps({
  bpm: {
    type: Number,
    default: 120
  },
  autoStart: {
    type: Boolean,
    default: true
  }
});

const letterRefs = ref<HTMLElement[]>([]);
const typingText = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const chatBoxRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const particleRef = ref<InstanceType<typeof P5Background> | null>(null);
const text = "4/4 & 5/8";

let gsapCtx: gsap.Context;

const metronome = reactive(new MetronomeV2());
metronome.updateTimeSignature(text);
metronome.beats[6].accent = 1;
metronome.updateBpm(props.bpm);

const beatDuration = 60 / props.bpm;

const isAccent = (index: number) => [0, 4, 6].includes(index);
const showSubmit = ref(false);

const goToMetronome = () => {
  window.location.href = "/metronome";
};

const handleSubmit = () => {
  showSubmit.value = false;
  gsap.to(chatBoxRef.value, {
    top: '20%',
    duration: 0.8,
    ease: "power1.inOut",
    onComplete: () => {
      animateLanding();
    }
  });
};

// Ensure handleSubmit is triggered on both click and touch events
const handleSubmitWrapper = () => {
  handleSubmit();
};

chatBoxRef.value?.addEventListener('click', handleSubmitWrapper);
chatBoxRef.value?.addEventListener('touchend', handleSubmitWrapper);

const typeText = async () => {
  
  if (!typingText.value || !chatBoxRef.value) return;

  for (let i = 0; i < text.length; i++) {
    typingText.value.textContent += text[i];
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  // Show the submit button instead of immediately animating
  showSubmit.value = true;
};

const animateLanding = () => {
  gsapCtx = gsap.context(() => {
    const tl = gsap.timeline();

    letterRefs.value.forEach((letter, index) => {
      tl
        .to(letter, {
          opacity: 1,
          y: isAccent(index) ? -20 : 0,
          duration: index > 3 ? beatDuration * 0.5 : beatDuration * 1,
        })
    });

    // 3D pulse animation
    tl.to(letterRefs.value, {
      scale: 1.1,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.inOut",
      y: 10,
      color: "white",
    });

    // Animate in the content after the title animation
    tl.to(contentRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
      onComplete: () => {
        // Fade in particle background after content animation
        particleRef.value?.fadeIn()
      }
    });

    tl.play();
    metronome.start();
    setTimeout(() => {
      metronome.stop();
    }, 3500);
  });
};

// Lifecycle hooks
onMounted(() => {
  chatBoxRef.value = document.querySelector('.chat-box') as HTMLElement;
  letterRefs.value = Array.from({ length: 9 }).map((_, i) => {
    return document.querySelector(`[data-letter-index="${i}"]`) as HTMLElement;
  });

  gsap.set(letterRefs.value, { opacity: 0, y: 20 });
  if (metronome instanceof MetronomeV2) metronome.setup();

  if (props.autoStart) {
    setTimeout(() => {
      typeText();
    }, 500);
  }
});

onUnmounted(() => {
  if (gsapCtx) {
    gsapCtx.revert();
  }
  metronome.clear();
});
</script>



<style scoped>
.flexonome-animated-title {
  display: inline-block;
  font-style: italic;
  position: relative;
  background-clip: text;
  text-shadow: 0 0 20px rgba(103, 232, 249, 0.3);
}

.chat-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-bottom: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  padding: 1rem 2rem;
  border-radius: 2rem;
  min-width: 400px;
  max-width: 400px;
  min-height: 100px;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.typing-text {
  color: white;
  font-family: monospace;
  font-size: 2.5rem;
  line-height: 1.5;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 2em;
  background-color: white;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .flexonome-animated-title {
    display: block;
    margin-top: 0.5rem;
  }

  .chat-box {
    padding: 0.75rem 1.5rem;
    min-width: 250px;
    max-width: 90%;
  }

  .typing-text {
    font-size: 1.8rem;
    line-height: 1.4;
    padding: 0.5rem 0;
  }

  .cursor {
    height: 1.8em;
  }
}

@media (max-width: 380px) {
  .typing-text {
    font-size: 1.5rem;
  }
  
  .chat-box {
    padding: 0.5rem 1rem;
  }
}

.submit-btn {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  background: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  min-width: 120px;
}

.submit-btn:hover {
  transform: translate(-50%, -2px) scale(1.05) rotateX(10deg);
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(103, 232, 249, 0.2);
}

.submit-btn:active {
  transform: translate(-50%, 0) scale(0.95) rotateX(0deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 20px) rotateX(-20deg);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0) rotateX(0deg);
  }
}
</style>