import { ref, onMounted } from 'vue'

export function useDevice() {
  const isMobile = ref(false)

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  const checkMobile = () => {
    isMobile.value = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  return {
    isMobile
  }
} 