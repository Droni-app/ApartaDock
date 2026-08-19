<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div>
        <DuiButton variant="ghost" color="neutral" size="sm" to="/admin/users">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Volver
        </DuiButton>
        <h1 class="mt-2 text-2xl">Detalle de usuario</h1>
      </div>
      <DuiButton v-if="user" color="primary" @click="showEditDrawer = true">
        <i class="mdi mdi-pencil-outline mr-1"></i>
        Editar
      </DuiButton>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500 dark:text-slate-400">Cargando...</p>

    <DuiCard v-else-if="user" title="Informacion del usuario">
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Nombre</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ user.fullName ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Correo</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ user.email }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Tipo de documento</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ user.documentType }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Documento</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ user.document ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Telefono</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ user.phone ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Rol</dt>
          <dd class="text-slate-900 dark:text-slate-100">{{ user.role }}</dd>
        </div>
      </dl>
    </DuiCard>

    <div v-if="user" class="mt-6">
      <UserEnrollments :user-id="user.id" :enrollments="user.enrollments ?? []" />
    </div>

    <Drawer v-model="showEditDrawer" title="Editar usuario">
      <UserForm
        mode="edit"
        :user="user"
        :loading="saving"
        :error-message="saveError"
        @submit="handleUpdate"
        @cancel="showEditDrawer = false"
      />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiCard } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'
import type { User } from '../../../types/users'
import Drawer from '../../../components/admin/Drawer.vue'
import UserForm from '../../../components/admin/users/Form.vue'
import UserEnrollments from '../../../components/admin/users/Enrollments.vue'

const route = useRoute()
const userId = route.params.id as string

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref('')

const showEditDrawer = ref(false)
const saving = ref(false)
const saveError = ref('')

function extractErrorMessage(err: unknown, fallback: string) {
  const axiosError = err as AxiosError<ApiErrorResponse>
  const body = axiosError.response?.data
  return (
    body?.errors?.[0]?.message ??
    body?.message ??
    (err instanceof Error ? err.message : fallback)
  )
}

async function fetchUser() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<User>(`/admin/users/${userId}`)
    user.value = response.data
  } catch (err) {
    user.value = null
    error.value = extractErrorMessage(err, 'Error inesperado al cargar el usuario.')
  } finally {
    loading.value = false
  }
}

async function handleUpdate(payload: Record<string, unknown>) {
  saving.value = true
  saveError.value = ''

  try {
    const response = await api.put<User>(`/admin/users/${userId}`, payload)
    user.value = response.data
    showEditDrawer.value = false
  } catch (err) {
    saveError.value = extractErrorMessage(err, 'Error inesperado al actualizar el usuario.')
  } finally {
    saving.value = false
  }
}

onMounted(fetchUser)
</script>
