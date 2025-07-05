import { ref } from 'vue';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Sign up with email and password
   */
  const signUpWithEmail = async (email: string, password: string, redirectTo?: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo || window.location.origin + '/auth/confirm',
        }
      });
      
      if (signUpError) throw signUpError;
      
      return { success: true };
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'An error occurred during sign up';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Sign in with email and password
   */
  const signInWithEmail = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
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
   * Reset password - sends password reset email
   */
  const resetPassword = async (email: string, redirectTo?: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || window.location.origin + '/auth/confirm',
      });
      
      if (resetError) throw resetError;
      
      return { success: true };
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'An error occurred during password reset';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update password (for authenticated users)
   */
  const updatePassword = async (newPassword: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      return { success: true };
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'An error occurred during password update';
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
    signUpWithEmail,
    signInWithEmail,
    resetPassword,
    updatePassword,
    signInWithOAuth,
    signOut
  };
}; 