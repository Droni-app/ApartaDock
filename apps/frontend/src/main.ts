import { createApp } from 'vue'
import './style.css'
import '@dronico/droni-kit/dist/droni-kit.css';
import App from './App.vue'
import router from './router'
import { createGtag } from "vue-gtag";
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const gtag = createGtag({
  tagId: "G-J2WTEEE99Q"
})

createApp(App)
  .use(gtag)
  .use(router)
  .mount('#app')
