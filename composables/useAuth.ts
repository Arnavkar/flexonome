import { ref } from 'vue';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Sign in with email magic link (passwordless)
   */
  const signInWithEmail = async (email: string, redirectTo?: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo || window.location.origin + '/auth/confirm',
        }
      });
      
      if (signInError) throw signInError;
      
      return { success: true };
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'An error occurred during sign in';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Sign in with OAuth provider
   */
  const signInWithOAuth = async (provider: 'google' | 'facebook', redirectTo?: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || window.location.origin + '/auth/confirm',
        }
      });
      
      if (signInError) throw signInError;
      
      return { success: true };
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'An error occurred during sign in';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
      
      return { success: true };
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'An error occurred during sign out';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithEmail,
    signInWithOAuth,
    signOut
  };
}; 