# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Caché y actualizaciones de la PWA

La PWA registra el service worker una sola vez (`src/composables/usePwaUpdate.ts`, usado
desde `App.vue`) y limpia precaches de versiones anteriores. Busca versiones nuevas cada 15
minutos y cada vez que la app vuelve a primer plano; cuando hay una, `App.vue` muestra el
aviso "Hay una nueva versión disponible". No registres el service worker en otro lugar
(por ejemplo, `registerSW` en `main.ts`).

**Versión de rescate (temporal):** `vite.config.ts` activa `skipWaiting`/`clientsClaim` e
importa `public/sw-rescue.js`, que recarga las ventanas abiertas cuando un service worker
nuevo reemplaza al anterior. Sirve para sacar a los usuarios atascados en versiones viejas
que no mostraban el aviso. Mientras esté activa no se muestra el aviso: la app se recarga
sola al detectar una versión nueva. Cuando la mayoría haya actualizado, quitar esas
opciones y el archivo para volver al aviso. Al publicar `dist`, configura el servidor o CDN con estas
cabeceras:

- `index.html`, `sw.js` y `manifest.webmanifest`: `Cache-Control: no-cache, no-store, must-revalidate`
- `assets/*`: `Cache-Control: public, max-age=31536000, immutable`

La primera regla permite detectar cada publicación nueva. La segunda aprovecha los
nombres con hash que genera Vite sin conservar archivos JavaScript o CSS antiguos
como entrada de la aplicación.
