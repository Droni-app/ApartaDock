<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DuiAction, DuiAlert, DuiButton, DuiCard, DuiInput, DuiLabel } from '@dronico/droni-kit'
import { useAuth } from '../../composables/useAuth'

const auth = useAuth()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
})

async function submit() {
  errorMessage.value = ''
  loading.value = true

  try {
    await auth.login(form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/units'
    await router.push(redirect)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Credenciales invalidas.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-4 grid place-items-center">
    <DuiCard class="w-full max-w-md" size="l" title="Iniciar sesion" subtitle="Accede para administrar tu conjunto residencial.">
      <form class="space-y-4" @submit.prevent="submit">
        <DuiLabel title="Correo" required>
          <DuiInput v-model="form.email" type="email" size="lg" block />
        </DuiLabel>

        <DuiLabel title="Contrasena" required>
          <DuiInput v-model="form.password" type="password" size="lg" block />
        </DuiLabel>

        <DuiAlert v-if="errorMessage" color="danger" variant="outline">
          {{ errorMessage }}
        </DuiAlert>

        <DuiButton type="submit" :loading="loading" color="primary" block size="lg">
          Entrar
        </DuiButton>
      </form>

      <template #footer>
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-slate-600">No tienes cuenta?</span>
          <DuiAction to="/auth/register" color="secondary" variant="ghost">
            Registrate aqui
          </DuiAction>
        </div>
      </template>
    </DuiCard>
  </main>
</template>
