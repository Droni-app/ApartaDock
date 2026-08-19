<template>
  <main class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <DuiToast position="bottom-right" :z-index="70" />
    <MainHeader v-if="isAuthenticated" />
    <RouterView class="my-3 container mx-auto" />
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
