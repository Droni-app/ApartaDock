<template>
  <main class="relative isolate min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-primary-500/10 to-transparent dark:from-primary-500/15"></div>
    <DuiToast position="bottom-right" :z-index="70" />
    <DuiAlert v-if="needRefresh" color="warning" variant="outline" rounded="all">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong>Hay una nueva versión disponible.</strong>
          Actualiza la aplicación para continuar con la versión más reciente.
        </p>
        <div class="flex shrink-0 flex-wrap gap-2">
          <DuiButton size="sm" color="primary" :loading="isUpdating" @click="activateUpdate">
            <i class="mdi mdi-refresh"></i>
            Actualizar ahora
          </DuiButton>
          <DuiButton size="sm" color="warning" variant="outline" :loading="isCleaning" @click="forceCleanAndUpdate">
            <i class="mdi mdi-cached"></i>
            Limpiar caché y actualizar
          </DuiButton>
        </div>
      </div>
    </DuiAlert>
    <MainHeader v-if="isAuthenticated" />
    <RouterView class="py-6 px-4 container mx-auto" />
    <footer class="mt-6 border-t border-slate-200 dark:border-white/10">
      <p class="container mx-auto px-4 py-6 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Política de privacidad y términos de uso: <a href="/legal/policy.html" target="_blank" class="font-medium text-primary dark:text-primary-400 hover:underline">Consulta aquí</a>.<br />
        &copy; 2026 ApartaDock. Realizado con ❤️ y mucho café por el equipo de <a href="https://droni.co" target="_blank" class="font-medium text-primary dark:text-primary-400 hover:underline">Droni.co</a> | v {{ version }}.
      </p>
    </footer>
  </main>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import MainHeader from './components/MainHeader.vue'
import { useAuth } from './composables/useAuth'
import { useTheme } from './composables/useTheme'
import { DuiAlert, DuiButton, DuiToast } from '@dronico/droni-kit'
import { usePwaUpdate } from './composables/usePwaUpdate'
import { version } from '../package.json'

const { user } = useAuth()
useTheme()
const { needRefresh, updateServiceWorker } = usePwaUpdate()
const isUpdating = ref(false)
const isCleaning = ref(false)

const isAuthenticated = computed(() => Boolean(user.value))

async function activateUpdate() {
  isUpdating.value = true
  await updateServiceWorker(true)
}

async function forceCleanAndUpdate() {
  if (isCleaning.value) return
  isCleaning.value = true

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      await registration?.unregister()
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys()
      const workboxCaches = cacheNames.filter((cacheName) => cacheName.startsWith('workbox-'))
      await Promise.all(workboxCaches.map((cacheName) => caches.delete(cacheName)))
    }

    window.location.reload()
  } catch (error) {
    console.error('No se pudo limpiar la caché de la aplicación.', error)
    isCleaning.value = false
    await updateServiceWorker(true)
  }
}
</script>
