import { computed, ref } from 'vue'

type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'apartadock_theme'

function readTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = localStorage.getItem(THEME_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<ThemeMode>(readTheme())

function applyTheme(value: ThemeMode) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', value === 'dark')
}

function setTheme(value: ThemeMode) {
  theme.value = value

  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, value)
  }

  applyTheme(value)
}

function toggleTheme() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

if (typeof window !== 'undefined') {
  applyTheme(theme.value)
}

export function useTheme() {
  return {
    theme,
    isDark: computed(() => theme.value === 'dark'),
    setTheme,
    toggleTheme,
  }
}