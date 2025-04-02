import { ref } from 'vue';
import { themes } from '../constants';

export const useTheme = () => {
  // Initialize with the current theme from localStorage or default
  const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') || themes[0] : themes[0];
  const currentTheme = ref(savedTheme);

  const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme.value = theme;
  };

  const toggleTheme = () => {
    const newTheme = currentTheme.value === themes[0] ? themes[1] : themes[0];
    setTheme(newTheme);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || themes[0];
    setTheme(savedTheme);
  };

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme
  };
}; 