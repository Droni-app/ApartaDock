<template>
  <main class="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 grid place-items-center">
    <section class="w-full max-w-md">
      <div class="mb-5 flex justify-center">
        <img src="/logo.webp" alt="Fontibon Reservado" class="h-20 w-20 rounded-xl object-contain shadow-sm" />
      </div>

      <DuiCard v-if="showCard === 'login'" class="w-full" size="l" title="Iniciar sesion" subtitle="Accede para consultar toda la información sobre tu conjunto residencial.">
        <DuiButton variant="outline" color="danger" block class="my-4" @click="googleLogin">
          <i class="mdi mdi-google mr-2"></i>
          Ingresar con Google
        </DuiButton>
        <form class="space-y-4" @submit.prevent="login">
          <DuiLabel title="Correo" required>
            <DuiInput v-model="form.email" type="email" size="lg" block />
          </DuiLabel>

          <DuiLabel title="Contrasena" required>
            <DuiInput v-model="form.password" type="password" size="lg" block />
          </DuiLabel>

          <p class="text-xs text-gray-500 dark:text-slate-400 mt-4">
            Al iniciar sesión, estás aceptando nuestra <a href="/legal/policy.html" target="_blank" class="text-pink-500 hover:underline">política de privacidad y términos de uso</a>.
          </p>

          <DuiButton type="submit" :loading="loading" block size="lg">
            Entrar
          </DuiButton>

          <div class="flex justify-end mt-2">
            <DuiButton type="button" size="sm" @click="showCard = 'sendReset'">
              ¿Olvidaste tu contraseña?
            </DuiButton>
          </div>
        </form>
      </DuiCard>

      <DuiCard v-if="showCard === 'sendReset'"  class="w-full" size="l" title="Recuperar contraseña" subtitle="Si olvidaste tu contraseña, puedes recuperarla aquí.">
        <form v-if="!resend" class="space-y-4" @submit.prevent="sendReset">
          <DuiLabel title="Correo" required>
            <DuiInput v-model="form.email" type="email" size="lg" block />
          </DuiLabel>

          <DuiButton type="submit" :loading="loading" block size="lg" class="mt-4">
            Enviar correo de recuperación
          </DuiButton>
        </form>
        <div v-else class="text-center">
          <p class="mb-4">Se ha enviado un correo de recuperación a {{ form.email }}. Por favor, revisa tu bandeja de entrada.</p>
          <DuiButton type="button" block size="lg" @click="showCard = 'login'">
            Volver al inicio de sesión
          </DuiButton>
        </div>
      </DuiCard>
    </section>
  </main>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DuiButton, DuiCard, DuiInput, DuiLabel, useToast } from '@dronico/droni-kit'
import { useAuth } from '../../composables/useAuth'

const auth = useAuth()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(false)
const showCard = ref('login')
const resend = ref(false)

const form = reactive({
  email: '',
  password: '',
})

async function login() {
  loading.value = true

  try {
    await auth.login(form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (error) {
    toast.add({
      color: 'danger',
      title: 'Error',
      message: 'Error al iniciar sesión. Por favor, verifica tus credenciales.',
    })
  } finally {
    loading.value = false
  }
}

async function sendReset() {
  loading.value = true
  console.log('Sending password reset email to:', form.email)

  try {
    await auth.sendPasswordReset(form.email)
    resend.value = true
    toast.add({
      color: 'success',
      title: 'Correo enviado',
      message: 'Correo de recuperación de contraseña enviado.'
    })
  } catch (error) {
    toast.add({
      color: 'danger',
      title: 'Error',
      message: 'Error al enviar el correo de recuperación.'
    })
  } finally {
    loading.value = false
  }
}

function googleLogin() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/redirect`
}
</script>