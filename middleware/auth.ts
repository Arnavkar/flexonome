// import { useAuth } from "~/composables/useAuth";
//Not being used right now

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for the landing page and auth pages
  if ((to.path === '/') || (to.path.startsWith('/auth/'))) {
    console.log('Landing page, skipping middleware');
    return;
  }

  // Check authentication for all other routes
  const { user } = useAuth();
  if (!user.value) {
    return navigateTo('/auth/login');
  }
}); 