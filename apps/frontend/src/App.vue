<template>
  <main class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <DuiToast position="bottom-right" :z-index="70" />
    <MainHeader v-if="isAuthenticated" />
    <RouterView class="py-3 container mx-auto" />
    <p class="text-center text-sm text-gray-500 dark:text-slate-400 py-4">
      &copy; 2026 ApartaDock. Realizado con ❤️ y mucho café por el equipo de <a href="https://droni.co" target="_blank" class="text-primary hover:underline">Droni.co</a>.
    </p>
  </main>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import MainHeader from './components/MainHeader.vue'
import { useAuth } from './composables/useAuth'
import { useTheme } from './composables/useTheme'
import { DuiToast } from '@dronico/droni-kit'

const { user } = useAuth()
useTheme()

const isAuthenticated = computed(() => Boolean(user.value))
</script>
