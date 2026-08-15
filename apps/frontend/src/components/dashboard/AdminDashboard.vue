<template>
  <div class="space-y-6">
    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <div v-if="loading" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <DuiSkeleton v-for="n in 3" :key="n" variant="rounded" height="84" />
    </div>

    <div v-else class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-account-group-outline" label="Usuarios" :value="usersTotal" hint="Total de usuarios registrados" color="primary" />
      <StatTile icon="mdi-office-building-outline" label="Unidades" :value="unitsTotal" hint="Total de unidades del conjunto" color="secondary" />
      <StatTile icon="mdi-history" label="Registros de auditoría" :value="logsTotal" hint="Acciones registradas en el sistema" color="neutral" />
    </div>

    <div>
      <h2 class="mb-3 text-lg font-semibold text-slate-900">Accesos rápidos</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DuiCard v-for="link in quickLinks" :key="link.to" :to="link.to" class="transition-shadow hover:shadow-md">
          <div class="flex flex-col items-start gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i :class="`mdi ${link.icon} text-xl`"></i>
            </div>
            <div>
              <p class="font-medium text-slate-900">{{ link.title }}</p>
              <p class="text-sm text-gray-500">{{ link.description }}</p>
            </div>
          </div>
        </DuiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiCard, DuiSkeleton } from '@dronico/droni-kit'
import { api } from '../../services/api'
import type { ApiErrorResponse, PaginatedResponse } from '../../types/api'
import type { User } from '../../types/users'
import type { Unit } from '../../types/units'
import type { Log } from '../../types/logs'
import StatTile from '../StatTile.vue'

const usersTotal = ref(0)
const unitsTotal = ref(0)
const logsTotal = ref(0)
const loading = ref(false)
const error = ref('')

const quickLinks = [
  { to: '/admin/users', icon: 'mdi-account-group-outline', title: 'Usuarios', description: 'Gestiona los usuarios del sistema.' },
  { to: '/admin/units', icon: 'mdi-office-building-outline', title: 'Unidades', description: 'Gestiona las unidades del conjunto.' },
  { to: '/admin/imports', icon: 'mdi-file-upload-outline', title: 'Imports', description: 'Carga masiva de información.' },
  { to: '/admin/records', icon: 'mdi-history', title: 'Records', description: 'Auditoría de acciones del sistema.' },
]

function extractErrorMessage(err: unknown, fallback: string) {
  const axiosError = err as AxiosError<ApiErrorResponse>
  const body = axiosError.response?.data
  return body?.errors?.[0]?.message ?? body?.message ?? (err instanceof Error ? err.message : fallback)
}

async function fetchDashboard() {
  loading.value = true
  error.value = ''

  try {
    const [usersResponse, unitsResponse, logsResponse] = await Promise.all([
      api.get<PaginatedResponse<User>>('/admin/users', { params: { limit: 1 } }),
      api.get<PaginatedResponse<Unit>>('/admin/units', { params: { limit: 1 } }),
      api.get<PaginatedResponse<Log>>('/admin/logs', { params: { limit: 1 } }),
    ])
    usersTotal.value = usersResponse.data.meta?.total ?? 0
    unitsTotal.value = unitsResponse.data.meta?.total ?? 0
    logsTotal.value = logsResponse.data.meta?.total ?? 0
  } catch (err) {
    error.value = extractErrorMessage(err, 'Error inesperado al cargar el resumen administrativo.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)
</script>
