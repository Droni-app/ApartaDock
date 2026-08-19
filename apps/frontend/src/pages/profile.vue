<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl">Mi perfil</h1>
      <small class="text-gray-500 dark:text-slate-400 block">Informacion de tu cuenta.</small>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500 dark:text-slate-400">Cargando...</p>

    <DuiCard v-else-if="profile" title="Informacion de la cuenta">
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Nombre</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ profile.fullName ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Correo</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ profile.email }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Tipo de documento</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ profile.documentType }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Documento</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ profile.document ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Telefono</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ profile.phone ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Rol</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ profile.role }}</dd>
        </div>
      </dl>
    </DuiCard>

    <DuiCard title="Cambiar contrasena">
      <form class="space-y-4" autocomplete="off" @submit.prevent="handleChangePassword">
        <DuiLabel title="Contrasena actual" required>
          <DuiInput
            v-model="passwordForm.currentPassword"
            type="password"
            size="lg"
            block
            autocomplete="current-password"
          />
        </DuiLabel>

        <DuiLabel title="Nueva contrasena" required help-text="Minimo 8 caracteres.">
          <DuiInput
            v-model="passwordForm.password"
            type="password"
            size="lg"
            block
            autocomplete="new-password"
          />
        </DuiLabel>

        <DuiLabel title="Confirmar nueva contrasena" required>
          <DuiInput
            v-model="passwordForm.passwordConfirmation"
            type="password"
            size="lg"
            block
            autocomplete="new-password"
          />
        </DuiLabel>

        <DuiAlert v-if="passwordError" color="danger" variant="outline">
          {{ passwordError }}
        </DuiAlert>
        <DuiAlert v-if="passwordSuccess" color="success" variant="outline">
          {{ passwordSuccess }}
        </DuiAlert>

        <div class="flex justify-end">
          <DuiButton type="submit" color="primary" :loading="changingPassword">
            Actualizar contrasena
          </DuiButton>
        </div>
      </form>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiCard, DuiInput, DuiLabel } from '@dronico/droni-kit'
import { api } from '../services/api'
import type { ApiErrorResponse } from '../types/api'
import type { AuthUser } from '../types/auth'

const profile = ref<AuthUser | null>(null)
const loading = ref(false)
const error = ref('')

const passwordForm = reactive({
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
})

const changingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

function extractErrorMessage(err: unknown, fallback: string) {
  const axiosError = err as AxiosError<ApiErrorResponse>
  const body = axiosError.response?.data
  return (
    body?.errors?.[0]?.message ??
    body?.message ??
    (err instanceof Error ? err.message : fallback)
  )
}

async function fetchProfile() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<AuthUser>('/account/profile')
    profile.value = response.data
  } catch (err) {
    profile.value = null
    error.value = extractErrorMessage(err, 'Error inesperado al cargar el perfil.')
  } finally {
    loading.value = false
  }
}

async function handleChangePassword() {
  changingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.password !== passwordForm.passwordConfirmation) {
    passwordError.value = 'La confirmacion no coincide con la nueva contrasena.'
    changingPassword.value = false
    return
  }

  try {
    await api.put('/account/profile/password', {
      currentPassword: passwordForm.currentPassword,
      password: passwordForm.password,
      password_confirmation: passwordForm.passwordConfirmation,
    })
    passwordSuccess.value = 'Contrasena actualizada correctamente.'
    passwordForm.currentPassword = ''
    passwordForm.password = ''
    passwordForm.passwordConfirmation = ''
  } catch (err) {
    passwordError.value = extractErrorMessage(err, 'Error inesperado al actualizar la contrasena.')
  } finally {
    changingPassword.value = false
  }
}

onMounted(fetchProfile)
</script>
