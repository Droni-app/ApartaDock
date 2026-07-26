<template>
 <div>
  <h1 class="text-2xl">Unidades</h1>
  <small class="text-gray-500 mb-4 block">
    Lista de unidades registradas en el sistema.
  </small>
  <DuiAlert v-if="error" color="danger" variant="outline">
    {{ error }}
  </DuiAlert>
  <form class="mb-4 flex max-w-sm gap-2" @submit.prevent="handleSearch">
    <DuiInput
      v-model="search"
      placeholder="Buscar por nombre..."
      block
    />
    <DuiButton type="submit" variant="outline" color="neutral" class="w-13">
      <i class="mdi mdi-magnify"></i>
    </DuiButton>
  </form>
  <DuiTable
    :loading="loading"
    :columns="columns"
    :rows="tableRows"
    :pagination="tablePagination"
    @paginate="handlePageChange"
  >
    <template #actions="row">
      <DuiButton size="sm" variant="outline" :to="`/admin/units/${row.id}`">
        Ver
      </DuiButton>
    </template>
  </DuiTable>
 </div>

      
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiInput, DuiTable } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse, PaginatedResponse } from '../../../types/api'
import type { Unit } from '../../../types/units'

const units = ref<Unit[]>([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const currentPage = ref(1)
const perPage = ref(20)
const lastPage = ref(1)
const search = ref('')

const columns = [
  { name: 'name', label: 'Nombre' },
  { name: 'tower', label: 'Torre' },
  { name: 'apto', label: 'Apto' },
  { name: 'floor', label: 'Piso' },
  { name: 'typology', label: 'Tipologia' },
  { name: 'buildArea', label: 'Area construida' },
  { name: 'privateArea', label: 'Area privada' },
  { name: 'coefficient', label: 'Coeficiente' },
  { name: 'status', label: 'Estado' },
  { name: 'actions', label: '' },
]

const totalItems = computed(() => total.value || units.value.length)
const tablePagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage.value,
  total: totalItems.value,
}))
const tableRows = computed(() =>
  units.value.map((unit) => ({
    ...unit,
    buildArea: unit.buildArea ?? '-',
    privateArea: unit.privateArea ?? '-',
    coefficient: unit.coefficient ?? '-',
  }))
)

async function fetchUnits(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<PaginatedResponse<Unit>>('/admin/units', {
      params: {
        page,
        limit: perPage.value,
        q: search.value || undefined,
      },
    })
    const payload = response.data
    const records = Array.isArray(payload.data) ? payload.data : []

    units.value = records
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    lastPage.value = payload.meta?.lastPage ?? 1
    total.value = payload.meta?.total ?? records.length
  } catch (err) {
    units.value = []
    lastPage.value = 1
    total.value = 0
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al cargar unidades.')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  fetchUnits(page)
}

function handleSearch() {
  fetchUnits(1)
}

onMounted(fetchUnits)
</script>
