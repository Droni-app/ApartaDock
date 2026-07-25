<template>
 <div>
  <h1 class="text-2xl">Usuarios</h1>
  <small class="text-gray-500 mb-4 block">
    Lista de usuarios registrados en el sistema.
  </small>
  <DuiAlert v-if="error" color="danger" variant="outline">
    {{ error }}
  </DuiAlert>
  <DuiTable
    :loading="loading"
    :columns="columns"
    :rows="tableRows"
    :pagination="tablePagination"
    @paginate="handlePageChange"
  />
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiTable } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse, PaginatedResponse } from '../../../types/api'
import type { User } from '../../../types/users'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const currentPage = ref(1)
const perPage = ref(20)
const lastPage = ref(1)

const columns = [
  { name: 'fullName', label: 'Nombre' },
  { name: 'email', label: 'Correo' },
  { name: 'documentType', label: 'Tipo de documento' },
  { name: 'document', label: 'Documento' },
  { name: 'phone', label: 'Telefono' },
  { name: 'role', label: 'Rol' },
]

const totalItems = computed(() => total.value || users.value.length)
const tablePagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage.value,
  total: totalItems.value,
}))
const tableRows = computed(() =>
  users.value.map((user) => ({
    ...user,
    fullName: user.fullName ?? '-',
    document: user.document ?? '-',
    phone: user.phone ?? '-',
  }))
)

async function fetchUsers(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<PaginatedResponse<User>>('/admin/users', {
      params: {
        page,
        limit: perPage.value,
      },
    })
    const payload = response.data
    const records = Array.isArray(payload.data) ? payload.data : []

    users.value = records
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    lastPage.value = payload.meta?.lastPage ?? 1
    total.value = payload.meta?.total ?? records.length
  } catch (err) {
    users.value = []
    lastPage.value = 1
    total.value = 0
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al cargar usuarios.')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  fetchUsers(page)
}

onMounted(fetchUsers)
</script>
