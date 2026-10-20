import { createApp } from 'vue'
import './style.css'
import '@dronico/droni-kit/dist/droni-kit.css';
import App from './App.vue'
import router from './router'
import { createGtag } from "vue-gtag";

// Si falla la carga de un chunk (p. ej. tras un deploy que borró los archivos
// anteriores), recarga una vez para traer la versión nueva.
window.addEventListener('vite:preloadError', () => {
  const key = 'apartadock_preload_reload'
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')
  window.location.reload()
})

const gtag = createGtag({
  tagId: "G-J2WTEEE99Q"
})

createApp(App)
  .use(gtag)
  .use(router)
  .mount('#app')
