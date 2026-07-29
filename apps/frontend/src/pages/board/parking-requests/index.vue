<template>
 <div>
  <h1 class="text-2xl">Solicitudes de parqueo</h1>
  <small class="text-gray-500 mb-4 block">
    Lista de solicitudes de parqueo registradas en el sistema.
  </small>

  <ParkingRequestsDashboard />

  <DuiAlert v-if="error" color="danger" variant="outline">
    {{ error }}
  </DuiAlert>

  <form class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5" @submit.prevent="handleSearch">
    <DuiLabel title="Unidad">
      <DuiInput v-model="filters.unitName" placeholder="Ej. 1102" block />
    </DuiLabel>
    <DuiLabel title="Correo del usuario">
      <DuiInput v-model="filters.userEmail" placeholder="usuario@correo.com" block />
    </DuiLabel>
    <DuiLabel title="Placa del vehiculo">
      <DuiInput v-model="filters.vehiclePlate" placeholder="Ej. ABC123" block />
    </DuiLabel>
    <DuiLabel title="Tipo de vehiculo">
      <DuiSelect v-model="filters.vehicleType" :options="vehicleTypeOptions" block />
    </DuiLabel>
    <DuiLabel title="Estado">
      <DuiSelect v-model="filters.status" :options="statusOptions" block />
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
    <template #status="row">
      <DuiBadge :color="statusColor(row.status)" variant="soft">{{ statusLabel(row.status) }}</DuiBadge>
    </template>
    <template #actions="row">
      <DuiButton size="sm" variant="outline" :to="`/board/parking-requests/${row.id}`">
        Ver
      </DuiButton>
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
import type { ParkingRequest } from '../../../types/parking_requests'
import ParkingRequestsDashboard from '../../../components/board/parking-requests/Dashboard.vue'

const parkingRequests = ref<ParkingRequest[]>([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const currentPage = ref(1)
const perPage = ref(20)
const lastPage = ref(1)

const filters = reactive({
  unitName: '',
  userEmail: '',
  vehiclePlate: '',
  vehicleType: '',
  status: '',
})

const vehicleTypeOptions = [
  { value: '', label: 'Todos' },
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Bicicleta' },
  { value: 'truck', label: 'Camion' },
  { value: 'other', label: 'Otro' },
]

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'cancelled', label: 'Cancelada' },
]

function statusLabel(status: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

function statusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'cancelled':
      return 'neutral'
    default:
      return 'warning'
  }
}

const columns = [
  { name: 'unitName', label: 'Unidad' },
  { name: 'userName', label: 'Usuario' },
  { name: 'vehiclePlate', label: 'Vehiculo' },
  { name: 'period', label: 'Periodo' },
  { name: 'status', label: 'Estado' },
  { name: 'actions', label: '' },
]

const totalItems = computed(() => total.value || parkingRequests.value.length)
const tablePagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage.value,
  total: totalItems.value,
}))
const tableRows = computed(() =>
  parkingRequests.value.map((parkingRequest) => ({
    ...parkingRequest,
    unitName: parkingRequest.unit?.name ?? '-',
    userName: parkingRequest.user?.fullName || parkingRequest.user?.email || '-',
    vehiclePlate: parkingRequest.vehicle?.plate ?? '-',
    period: `${parkingRequest.period.toUpperCase()} ${parkingRequest.periodYear}`,
  }))
)

async function fetchParkingRequests(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<PaginatedResponse<ParkingRequest>>('/board/parking-requests', {
      params: {
        page,
        limit: perPage.value,
        unit_name: filters.unitName || undefined,
        user_email: filters.userEmail || undefined,
        vehicle_plate: filters.vehiclePlate || undefined,
        vehicle_type: filters.vehicleType || undefined,
        status: filters.status || undefined,
      },
    })
    const payload = response.data
    const records = Array.isArray(payload.data) ? payload.data : []

    parkingRequests.value = records
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    lastPage.value = payload.meta?.lastPage ?? 1
    total.value = payload.meta?.total ?? records.length
  } catch (err) {
    parkingRequests.value = []
    lastPage.value = 1
    total.value = 0
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al cargar las solicitudes de parqueo.')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  fetchParkingRequests(page)
}

function handleSearch() {
  fetchParkingRequests(1)
}

function handleClear() {
  filters.unitName = ''
  filters.userEmail = ''
  filters.vehiclePlate = ''
  filters.vehicleType = ''
  filters.status = ''
  fetchParkingRequests(1)
}

onMounted(fetchParkingRequests)
</script>
