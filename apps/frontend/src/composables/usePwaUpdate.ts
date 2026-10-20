import { useRegisterSW } from 'virtual:pwa-register/vue'

const UPDATE_CHECK_INTERVAL_MS = 15 * 60 * 1000

/**
 * Registers the service worker (only once, from App.vue) and keeps looking for
 * new deployments. Browsers only check `sw.js` on full navigations, which an
 * SPA or an installed PWA rarely does, so we check periodically and whenever
 * the app comes back to the foreground.
 */
export function usePwaUpdate() {
  async function checkForUpdate(swUrl: string, registration: ServiceWorkerRegistration) {
    if (registration.installing || !navigator.onLine) return

    try {
      const response = await fetch(swUrl, {
        cache: 'no-store',
        headers: { 'cache-control': 'no-cache' },
      })
      if (response.status === 200) {
        await registration.update()
      }
    } catch {
      // Offline or server unavailable: try again on the next check.
    }
  }

  return useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      if (!registration) return

      setInterval(() => checkForUpdate(swUrl, registration), UPDATE_CHECK_INTERVAL_MS)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkForUpdate(swUrl, registration)
        }
      })
    },
  })
}
