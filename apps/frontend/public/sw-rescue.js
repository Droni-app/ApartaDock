// Versión de rescate: cuando un service worker nuevo reemplaza a uno anterior,
// recarga las ventanas abiertas para que salgan de la versión vieja aunque su
// código no muestre el aviso de actualización. Temporal: ver vite.config.ts.
let isUpdate = false

self.addEventListener('install', () => {
  isUpdate = Boolean(self.registration.active)
})

self.addEventListener('activate', (event) => {
  if (!isUpdate) return

  event.waitUntil(
    self.clients
      .claim()
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) =>
        Promise.all(clients.map((client) => client.navigate(client.url).catch(() => undefined)))
      )
  )
})
