<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Reporte de visitantes"
      description="Consulta ingresos, horas y cobros por periodo."
    />

    <form class="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-5" @submit.prevent="handleSearch">
      <DuiLabel title="Desde">
        <DuiInput v-model="filters.fromDate" type="date" block />
      </DuiLabel>
      <DuiLabel title="Hasta">
        <DuiInput v-model="filters.toDate" type="date" block />
      </DuiLabel>
      <DuiLabel title="Tipo de vehículo">
        <DuiSelect v-model="filters.vehicleType" :options="vehicleTypeOptions" block />
      </DuiLabel>
      <div class="flex gap-2 lg:col-span-2">
        <DuiButton type="submit" color="primary" :loading="loading">
          <i class="mdi mdi-magnify mr-1"></i>
          Filtrar
        </DuiButton>
        <DuiButton type="button" variant="outline" color="neutral" :disabled="loading" @click="handleClear">
          Limpiar
        </DuiButton>
      </div>
    </form>

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section class="border border-gray-200 p-4 dark:border-slate-700">
        <p class="text-sm text-gray-500 dark:text-slate-400">Horas acumuladas</p>
        <p class="mt-1 text-2xl font-semibold">{{ formatHours(totalHours) }}</p>
      </section>
      <section class="border border-gray-200 p-4 dark:border-slate-700">
        <p class="text-sm text-gray-500 dark:text-slate-400">Total cobrado</p>
        <p class="mt-1 text-2xl font-semibold">{{ formatCurrency(totalAmount) }}</p>
      </section>
    </div>

    <DuiTable
      :columns="columns"
      :rows="visitors"
      :loading="loading"
    >
      <template #visitor="{ fullName, document }">
        <strong>{{ fullName || 'Visitante sin nombre' }}</strong><br />
        <small>{{ document || 'Sin documento' }}</small>
      </template>
      <template #unit="{ unit }">
        <template v-if="unit">
          <strong>Torre {{ unit.tower }} · Apto {{ unit.apto }}</strong><br />
          <small>{{ unit.name }}</small>
        </template>
        <span v-else>-</span>
      </template>
      <template #vehicle="{ plate, vehicleType }">
        <strong>{{ plate || 'Sin placa' }}</strong><br />
        <small>{{ vehicleTypeLabel(vehicleType) }}</small>
      </template>
      <template #period="{ checkinDate, checkoutDate }">
        Ingreso: {{ formatDate(checkinDate) }}<br />
        <small>Salida: {{ formatDate(checkoutDate) }}</small>
      </template>
      <template #hours="{ hours }">
        {{ formatHours(hours) }}
      </template>
      <template #amount="{ total }">
        {{ formatCurrency(total) }}
      </template>
      <template #authorization="{ authorization }">
        {{ authorization?.fullName || 'Sin autorización' }}
      </template>
      <template #actions="{ id, hours, checkoutDate }">
        <DuiButton
          v-if="hours === null && checkoutDate"
          size="sm"
          color="primary"
          variant="outline"
          :loading="recalculatingId === id"
          :disabled="recalculatingId !== null"
          @click="recalculateVisitor(id)"
        >
          <i class="mdi mdi-calculator-variant-outline mr-1"></i>
          Recalcular
        </DuiButton>
      </template>
    </DuiTable>

    <DuiPagination
      v-model="currentPage"
      color="primary"
      :perPage="perPage"
      :total="recordCount"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { AxiosError } from 'axios'
import {
  DuiAlert,
  DuiButton,
  DuiInput,
  DuiLabel,
  DuiPagination,
  DuiSelect,
  DuiTable,
} from '@dronico/droni-kit'
import { api } from '@/services/api'
import UiTitlePage from '@/components/Ui/TitlePage.vue'
import type { ApiErrorResponse, PaginatedResponse } from '@/types/api'

interface VisitorReportRow {
  id: number
  fullName: string | null
  document: string | null
  plate: string | null
  vehicleType: string | null
  checkinDate: string | null
  checkoutDate: string | null
  hours: number | null
  total: number | null
  unit: { name: string; tower: number; apto: number } | null
  authorization: { fullName: string | null } | null
}

interface VisitorReportResponse extends PaginatedResponse<VisitorReportRow> {
  total?: number
  totalHours?: number
}

function dateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function defaultDates() {
  const to = new Date()
  const from = new Date(to)
  from.setDate(from.getDate() - 30)
  return { fromDate: dateInputValue(from), toDate: dateInputValue(to) }
}

const filters = reactive({
  ...defaultDates(),
  vehicleType: '',
})
const vehicleTypeOptions = [
  { value: '', label: 'Todos' },
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Bicicleta' },
]
const columns = [
  { name: 'visitor', label: 'Visitante' },
  { name: 'unit', label: 'Unidad' },
  { name: 'vehicle', label: 'Vehículo' },
  { name: 'period', label: 'Periodo' },
  { name: 'hours', label: 'Horas' },
  { name: 'amount', label: 'Total' },
  { name: 'authorization', label: 'Autorización' },
  { name: 'actions', label: 'Acciones' },
]

const visitors = ref<VisitorReportRow[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const perPage = ref(20)
const recordCount = ref(0)
const totalAmount = ref(0)
const totalHours = ref(0)
const recalculatingId = ref<number | null>(null)

function vehicleTypeLabel(vehicleType: string | null) {
  return vehicleTypeOptions.find((option) => option.value === vehicleType)?.label ?? '-'
}

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

function formatHours(value: number | null) {
  return `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value ?? 0)} h`
}

function formatCurrency(value: number | null) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}

async function fetchReport(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<VisitorReportResponse>('/security/visitors/report', {
      params: {
        page,
        limit: perPage.value,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        vehicleType: filters.vehicleType || undefined,
      },
    })
    const payload = response.data
    visitors.value = Array.isArray(payload.data) ? payload.data : []
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    recordCount.value = payload.meta?.total ?? visitors.value.length
    totalAmount.value = Number(payload.total ?? 0)
    totalHours.value = Number(payload.totalHours ?? 0)
  } catch (err) {
    visitors.value = []
    recordCount.value = 0
    totalAmount.value = 0
    totalHours.value = 0
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'No se pudo cargar el reporte de visitantes.')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchReport(1)
}

function handleClear() {
  Object.assign(filters, { ...defaultDates(), vehicleType: '' })
  fetchReport(1)
}

function handlePageChange(page: number) {
  fetchReport(page)
}

async function recalculateVisitor(id: number) {
  recalculatingId.value = id
  error.value = ''

  try {
    await api.get(`/security/visitors/${id}`)
    await fetchReport(currentPage.value)
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'No se pudieron recalcular las horas del visitante.')
  } finally {
    recalculatingId.value = null
  }
}

onMounted(() => fetchReport())
</script>