import { computed } from 'vue';

export const useCurrentUser = () => {
  const user = useSupabaseUser();
  
  // Computed property to check if the user is logged in
  const isLoggedIn = computed(() => !!user.value);
  
  // Computed property to get user's email
  const email = computed(() => user.value?.email || '');
  
  // Computed property to get user's ID
  const id = computed(() => user.value?.id || '');
  
  // Get user metadata
  const metadata = computed(() => user.value?.user_metadata || {});
  
  // Function to check if user has completed profile setup
  const hasCompletedProfile = computed(() => {
    // Add your logic to determine if profile is complete
    // For example, check if certain fields exist in user metadata
    return !!metadata.value?.full_name;
  });
  
  return {
    user,
    isLoggedIn,
    email,
    id,
    metadata,
    hasCompletedProfile
  };
}; 