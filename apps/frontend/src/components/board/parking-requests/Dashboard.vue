<template>
  <div class="mb-6">
    <DuiAlert v-if="error" color="danger" variant="outline" class="mb-4">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500 dark:text-slate-400">Cargando...</p>

    <div v-else-if="dashboard" class="space-y-4">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile icon="mdi-car-multiple" label="Total" :value="total" color="primary" />
        <StatTile
          v-for="status in statusTiles"
          :key="status.key"
          :icon="status.icon"
          :label="status.label"
          :value="status.total"
          :color="status.tileColor"
        />
      </div>

      <DuiCard
        title="Vehiculos de solicitudes aprobadas"
        subtitle="Distribucion por tipo de vehiculo, solo solicitudes aprobadas"
      >
        <div class="h-64">
          <Bar :data="vehicleTypeChartData" :options="vehicleTypeChartOptions" />
        </div>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { AxiosError } from 'axios'
import { DuiAlert, DuiCard } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'
import type { ParkingRequestDashboard } from '../../../types/parking_requests'
import { baseChartOptions, CATEGORICAL_COLORS, CHART_INK } from '../../../utils/charts'
import StatTile from '../../StatTile.vue'

const dashboard = ref<ParkingRequestDashboard | null>(null)
const loading = ref(false)
const error = ref('')

const STATUS_META: Record<
  string,
  { label: string; icon: string; tileColor: 'warning' | 'success' | 'danger' | 'neutral' }
> = {
  pending: { label: 'Pendientes', icon: 'mdi-clock-outline', tileColor: 'warning' },
  approved: { label: 'Aprobadas', icon: 'mdi-check-circle-outline', tileColor: 'success' },
  rejected: { label: 'Rechazadas', icon: 'mdi-close-circle-outline', tileColor: 'danger' },
  cancelled: { label: 'Canceladas', icon: 'mdi-cancel', tileColor: 'neutral' },
}

const STATUS_ORDER = ['pending', 'approved', 'rejected', 'cancelled']

const VEHICLE_TYPE_META: Record<string, { label: string; color: string }> = {
  car: { label: 'Carro', color: CATEGORICAL_COLORS[0] },
  motorcycle: { label: 'Moto', color: CATEGORICAL_COLORS[1] },
  bicycle: { label: 'Bicicleta', color: CATEGORICAL_COLORS[2] },
  truck: { label: 'Camion', color: CATEGORICAL_COLORS[3] },
  other: { label: 'Otro', color: CATEGORICAL_COLORS[4] },
}

const VEHICLE_TYPE_ORDER = ['car', 'motorcycle', 'bicycle', 'truck', 'other']

const total = computed(() =>
  dashboard.value ? dashboard.value.byStatus.reduce((sum, row) => sum + row.total, 0) : 0
)

const statusTiles = computed(() => {
  if (!dashboard.value) {
    return []
  }
  const totals = new Map(dashboard.value.byStatus.map((row) => [row.status, row.total]))
  return STATUS_ORDER.map((key) => ({
    key,
    total: totals.get(key) ?? 0,
    ...STATUS_META[key],
  }))
})

const vehicleTypeChartData = computed(() => {
  if (!dashboard.value) {
    return { labels: [], datasets: [] }
  }

  const totals = new Map(dashboard.value.byVehicleTypeApproved.map((row) => [row.vehicleType, row.total]))
  const withoutVehicle = totals.get(null) ?? 0

  const entries = VEHICLE_TYPE_ORDER.map((key) => ({
    label: VEHICLE_TYPE_META[key].label,
    color: VEHICLE_TYPE_META[key].color,
    total: totals.get(key) ?? 0,
  }))

  if (withoutVehicle > 0) {
    entries.push({ label: 'Sin vehiculo', color: CHART_INK.muted, total: withoutVehicle })
  }

  return {
    labels: entries.map((entry) => entry.label),
    datasets: [
      {
        label: 'Solicitudes aprobadas',
        data: entries.map((entry) => entry.total),
        backgroundColor: entries.map((entry) => entry.color),
        borderRadius: 4,
      },
    ],
  }
})

const vehicleTypeChartOptions = {
  ...baseChartOptions,
  indexAxis: 'y' as const,
  plugins: { ...baseChartOptions.plugins, legend: { display: false } },
  scales: {
    x: baseChartOptions.scales.y,
    y: baseChartOptions.scales.x,
  },
}

function extractErrorMessage(err: unknown, fallback: string) {
  const axiosError = err as AxiosError<ApiErrorResponse>
  const body = axiosError.response?.data
  return (
    body?.errors?.[0]?.message ??
    body?.message ??
    (err instanceof Error ? err.message : fallback)
  )
}

async function fetchDashboard() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<ParkingRequestDashboard>('/board/parking-requests/dashboard')
    dashboard.value = response.data
  } catch (err) {
    dashboard.value = null
    error.value = extractErrorMessage(err, 'Error inesperado al cargar el dashboard.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)
</script>
