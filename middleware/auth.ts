// import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware completely for the landing page
  if (to.path === '/') {
    console.log('Landing page, skipping middleware');
    return;
  }
  
  // Skip middleware for auth pages
  if (to.path.startsWith('/auth/')) {
    return;
  }
  
  // Check authentication for all other routes
  const { user } = useAuth();
  if (!user.value) {
    console.log('No authenticated user, redirecting to login');
    return navigateTo('/auth/login');
  }
}); 