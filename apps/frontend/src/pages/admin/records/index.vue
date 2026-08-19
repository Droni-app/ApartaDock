<template>
 <div>
  <h1 class="text-2xl">Logs</h1>
  <small class="text-gray-500 dark:text-slate-400 mb-4 block">
    Registro de acciones (POST, PUT, PATCH, DELETE) realizadas en el sistema.
  </small>

  <DuiAlert v-if="error" color="danger" variant="outline">
    {{ error }}
  </DuiAlert>

  <form class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" @submit.prevent="handleSearch">
    <DuiLabel title="Usuario">
      <DuiInput v-model="filters.userEmail" placeholder="usuario@correo.com" block />
    </DuiLabel>
    <DuiLabel title="Metodo">
      <DuiSelect v-model="filters.method" :options="methodOptions" block />
    </DuiLabel>
    <DuiLabel title="Endpoint">
      <DuiInput v-model="filters.endpoint" placeholder="Ej. /admin/users" block />
    </DuiLabel>

    <div class="col-span-full flex gap-2">
      <DuiButton type="submit" color="primary">
        <i class="mdi mdi-magnify mr-1"></i>
        Filtrar
      </DuiButton>
      <DuiButton type="button" variant="outline" color="neutral" @click="handleClear">
        Limpiar
      </DuiButton>
    </div>
  </form>

  <DuiTable
    :loading="loading"
    :columns="columns"
    :rows="tableRows"
    :pagination="tablePagination"
    @paginate="handlePageChange"
  >
    <template #method="row">
      <DuiBadge :color="methodColor(row.method)" variant="soft">{{ row.method }}</DuiBadge>
    </template>
    <template #payload="row">
      <span class="block max-w-xs truncate text-gray-500 dark:text-slate-400" :title="row.payload ?? ''">{{ row.payload ?? '-' }}</span>
    </template>
  </DuiTable>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiBadge, DuiButton, DuiInput, DuiLabel, DuiSelect, DuiTable } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse, PaginatedResponse } from '../../../types/api'
import type { Log } from '../../../types/logs'

const logs = ref<Log[]>([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const currentPage = ref(1)
const perPage = ref(20)
const lastPage = ref(1)

const filters = reactive({
  userEmail: '',
  method: '',
  endpoint: '',
})

const methodOptions = [
  { value: '', label: 'Todos' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

function methodColor(method: string) {
  switch (method) {
    case 'POST':
      return 'success'
    case 'PUT':
    case 'PATCH':
      return 'warning'
    case 'DELETE':
      return 'danger'
    default:
      return 'neutral'
  }
}

const columns = [
  { name: 'createdAt', label: 'Fecha' },
  { name: 'userName', label: 'Usuario' },
  { name: 'method', label: 'Metodo' },
  { name: 'endpoint', label: 'Endpoint' },
  { name: 'payload', label: 'Payload' },
]

const totalItems = computed(() => total.value || logs.value.length)
const tablePagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage.value,
  total: totalItems.value,
}))
const tableRows = computed(() =>
  logs.value.map((log) => ({
    ...log,
    userName: log.user?.fullName || log.user?.email || '-',
    createdAt: formatDate(log.createdAt),
  }))
)

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString()
}

async function fetchLogs(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<PaginatedResponse<Log>>('/admin/logs', {
      params: {
        page,
        limit: perPage.value,
        user_email: filters.userEmail || undefined,
        method: filters.method || undefined,
        endpoint: filters.endpoint || undefined,
      },
    })
    const payload = response.data
    const records = Array.isArray(payload.data) ? payload.data : []

    logs.value = records
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    lastPage.value = payload.meta?.lastPage ?? 1
    total.value = payload.meta?.total ?? records.length
  } catch (err) {
    logs.value = []
    lastPage.value = 1
    total.value = 0
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al cargar los logs.')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  fetchLogs(page)
}

function handleSearch() {
  fetchLogs(1)
}

function handleClear() {
  filters.userEmail = ''
  filters.method = ''
  filters.endpoint = ''
  fetchLogs(1)
}

onMounted(fetchLogs)
</script>
