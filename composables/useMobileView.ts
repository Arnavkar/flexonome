import { ref, onMounted, onUnmounted } from 'vue'

export function useMobileView() {
  const isMobile = ref(false)
  const MOBILE_BREAKPOINT = 980 // Breakpoint for mobile view in pixels

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  const checkMobile = () => {
    // Check both user agent and window width
    const userAgentMobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const widthMobile = window.innerWidth < MOBILE_BREAKPOINT
    
    isMobile.value = userAgentMobile || widthMobile
  }

  return {
    isMobile
  }
} 