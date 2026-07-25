<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DuiAction,
  DuiAlert,
  DuiButton,
  DuiCard,
  DuiInput,
  DuiLabel,
  DuiSelect,
} from '@dronico/droni-kit'
import { type DocumentType, useAuth } from '../../composables/useAuth'

const auth = useAuth()
const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  fullName: '',
  email: '',
  documentType: 'CC' as DocumentType,
  document: '',
  password: '',
  passwordConfirmation: '',
})

const documentTypeOptions = [
  { label: 'CC', value: 'CC' },
  { label: 'CE', value: 'CE' },
  { label: 'TI', value: 'TI' },
  { label: 'PP', value: 'PP' },
]

async function submit() {
  errorMessage.value = ''

  if (form.password !== form.passwordConfirmation) {
    errorMessage.value = 'Las contrasenas no coinciden.'
    return
  }

  loading.value = true

  try {
    await auth.signup({
      fullName: form.fullName || null,
      email: form.email,
      documentType: form.documentType,
      document: form.document,
      password: form.password,
      passwordConfirmation: form.passwordConfirmation,
    })
    await router.push('/units')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'No se pudo crear la cuenta.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-4 grid place-items-center">
    <DuiCard class="w-full max-w-2xl" size="l" title="Crear cuenta" subtitle="Registra tu perfil de residente.">
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
        <div class="sm:col-span-2">
          <DuiLabel title="Nombre completo">
            <DuiInput v-model="form.fullName" size="lg" block />
          </DuiLabel>
        </div>

        <div class="sm:col-span-2">
          <DuiLabel title="Correo" required>
            <DuiInput v-model="form.email" type="email" size="lg" block />
          </DuiLabel>
        </div>

        <DuiLabel title="Tipo de documento" required>
          <DuiSelect
            v-model="form.documentType"
            :options="documentTypeOptions"
            item-label="label"
            item-value="value"
            size="lg"
            block
          />
        </DuiLabel>

        <DuiLabel title="Numero de documento" required>
          <DuiInput v-model="form.document" size="lg" block />
        </DuiLabel>

        <DuiLabel title="Contrasena" required>
          <DuiInput v-model="form.password" type="password" size="lg" block />
        </DuiLabel>

        <DuiLabel title="Confirmar contrasena" required>
          <DuiInput v-model="form.passwordConfirmation" type="password" size="lg" block />
        </DuiLabel>

        <div class="sm:col-span-2 space-y-3">
          <DuiAlert v-if="errorMessage" color="danger" variant="outline">
            {{ errorMessage }}
          </DuiAlert>

          <DuiButton type="submit" :loading="loading" color="warning" block size="lg">
            Crear cuenta
          </DuiButton>
        </div>
      </form>

      <template #footer>
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-slate-600">Ya tienes cuenta?</span>
          <DuiAction to="/auth/login" color="primary" variant="ghost">
            Inicia sesion
          </DuiAction>
        </div>
      </template>
    </DuiCard>
  </main>
</template>
