# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Caché y actualizaciones de la PWA

La PWA registra el service worker con actualización inmediata y limpia precaches de
versiones anteriores. Al publicar `dist`, configura el servidor o CDN con estas
cabeceras:

- `index.html`, `sw.js` y `manifest.webmanifest`: `Cache-Control: no-cache, no-store, must-revalidate`
- `assets/*`: `Cache-Control: public, max-age=31536000, immutable`

La primera regla permite detectar cada publicación nueva. La segunda aprovecha los
nombres con hash que genera Vite sin conservar archivos JavaScript o CSS antiguos
como entrada de la aplicación.
