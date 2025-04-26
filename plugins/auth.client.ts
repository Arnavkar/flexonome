import { navigateTo } from 'nuxt/app';

// This plugin only runs on the client side due to .client.ts extension
export default defineNuxtPlugin({
  name: 'auth-plugin',
  enforce: 'pre', // Run before other plugins
  async setup() {
    // Extra safety check to ensure this only runs on client
    if (typeof window === 'undefined') {
      return;
    }
    
    // Get access to the Supabase client and router
    const supabase = useSupabaseClient();
    const router = useRouter();
        
    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      
      // When the user signs in
      if (event === 'SIGNED_IN' && session) {
        // User signed in, redirect to metronome if on auth page
        if (router.currentRoute.value.path.includes('/auth/')) {
          await navigateTo('/metronome');
        }
      }
      
      // When the user signs out
      if (event === 'SIGNED_OUT') {
        // User signed out, redirect to intro page only if not already there
        if (router.currentRoute.value.path !== '/') {
          await navigateTo('/');
        }
      }
    });
  }
}); 