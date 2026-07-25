<template>
 <div>
  <div class="mb-4 flex items-center justify-between">
    <div>
      <h1 class="text-2xl">Usuarios</h1>
      <small class="text-gray-500 block">
        Lista de usuarios registrados en el sistema.
      </small>
    </div>
    <DuiButton color="primary" @click="showCreateDrawer = true">
      <i class="mdi mdi-account-plus-outline mr-1"></i>
      Nuevo usuario
    </DuiButton>
  </div>

  <DuiAlert v-if="error" color="danger" variant="outline">
    {{ error }}
  </DuiAlert>
  <DuiTable
    :loading="loading"
    :columns="columns"
    :rows="tableRows"
    :pagination="tablePagination"
    @paginate="handlePageChange"
  >
    <template #actions="row">
      <DuiButton size="sm" variant="outline" :to="`/admin/users/${row.id}`">
        Ver
      </DuiButton>
    </template>
  </DuiTable>

  <Drawer v-model="showCreateDrawer" title="Nuevo usuario">
    <UserForm
      mode="create"
      :loading="creating"
      :error-message="createError"
      @submit="handleCreate"
      @cancel="showCreateDrawer = false"
    />
  </Drawer>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiTable } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse, PaginatedResponse } from '../../../types/api'
import type { User } from '../../../types/users'
import Drawer from '../../../components/admin/Drawer.vue'
import UserForm from '../../../components/admin/users/Form.vue'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const currentPage = ref(1)
const perPage = ref(20)
const lastPage = ref(1)

const showCreateDrawer = ref(false)
const creating = ref(false)
const createError = ref('')

const columns = [
  { name: 'fullName', label: 'Nombre' },
  { name: 'email', label: 'Correo' },
  { name: 'documentType', label: 'Tipo de documento' },
  { name: 'document', label: 'Documento' },
  { name: 'phone', label: 'Telefono' },
  { name: 'role', label: 'Rol' },
  { name: 'actions', label: '' },
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

async function handleCreate(payload: Record<string, unknown>) {
  creating.value = true
  createError.value = ''

  try {
    await api.post('/admin/users', payload)
    showCreateDrawer.value = false
    await fetchUsers(1)
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    createError.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al crear el usuario.')
  } finally {
    creating.value = false
  }
}

function handlePageChange(page: number) {
  fetchUsers(page)
}

onMounted(fetchUsers)
</script>
