import { navigateTo } from 'nuxt/app';

export default defineNuxtPlugin({
  name: 'auth-plugin',
  enforce: 'pre', // Run before other plugins
  async setup() {
    //Ensure this only runs on client
    if (typeof window === 'undefined') {
      return;
    }
    
    const supabase = useSupabaseClient();
    const router = useRouter();
    supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (event === 'SIGNED_IN' && session) {
        // User signed in, redirect to metronome if on auth page
        if (router.currentRoute.value.path.includes('/auth/')) {
          await navigateTo('/metronome');
        }
      }
      
      if (event === 'SIGNED_OUT') {
        if (router.currentRoute.value.path !== '/') {
          await navigateTo('/');
        }
      }
    });
  }
}); 