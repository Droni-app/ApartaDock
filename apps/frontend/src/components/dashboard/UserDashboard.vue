<template>
  <div class="space-y-6">
    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <div v-if="loading" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <DuiSkeleton v-for="n in 2" :key="n" variant="rounded" height="84" />
    </div>

    <div v-else class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-home-city-outline" label="Mis unidades" :value="enrollments.length" :hint="unitsHint" color="primary" />
      <StatTile icon="mdi-car-outline" label="Vehículos registrados" :value="vehicles.length" :hint="vehiclesHint" color="secondary" />
    </div>

    <div>
      <h2 class="mb-3 text-lg font-semibold text-slate-900">Accesos rápidos</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
import { computed, onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiCard, DuiSkeleton } from '@dronico/droni-kit'
import { api } from '../../services/api'
import type { ApiErrorResponse } from '../../types/api'
import type { Enrollment } from '../../types/enrollments'
import type { Vehicle } from '../../types/vehicles'
import StatTile from '../StatTile.vue'

const enrollments = ref<Enrollment[]>([])
const vehicles = ref<Vehicle[]>([])
const loading = ref(false)
const error = ref('')

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  car: 'carro',
  motorcycle: 'moto',
  bicycle: 'bicicleta',
  truck: 'camión',
  other: 'otro',
}

const quickLinks = [
  { to: '/management/units', icon: 'mdi-home-city-outline', title: 'Unidades', description: 'Tus unidades y su información.' },
  { to: '/management/account-status', icon: 'mdi-file-chart-outline', title: 'Estado de cuenta', description: 'Cartera, pagos y cargos.' },
  { to: '/management/reservations', icon: 'mdi-calendar-check-outline', title: 'Reservas', description: 'Zonas comunes disponibles.' },
  { to: '/management/vehicles', icon: 'mdi-car-outline', title: 'Vehículos', description: 'Vehículos registrados.' },
  { to: '/management/authorizations', icon: 'mdi-badge-account-outline', title: 'Autorizaciones', description: 'Ingreso de visitantes.' },
]

const unitsHint = computed(() => {
  if (enrollments.value.length === 0) {
    return 'Sin unidades asignadas'
  }
  if (enrollments.value.length === 1) {
    const unit = enrollments.value[0].unit
    return unit ? `Torre ${unit.tower} - Apto ${unit.apto}` : undefined
  }
  return `${enrollments.value.length} unidades asignadas`
})

const vehiclesHint = computed(() => {
  if (vehicles.value.length === 0) {
    return 'Sin vehículos registrados'
  }

  const counts = new Map<string, number>()
  for (const vehicle of vehicles.value) {
    const key = vehicle.vehicleType ?? 'other'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([type, count]) => `${count} ${VEHICLE_TYPE_LABELS[type] ?? type}`)
    .join(', ')
})

function extractErrorMessage(err: unknown, fallback: string) {
  const axiosError = err as AxiosError<ApiErrorResponse>
  const body = axiosError.response?.data
  return body?.errors?.[0]?.message ?? body?.message ?? (err instanceof Error ? err.message : fallback)
}

async function fetchDashboard() {
  loading.value = true
  error.value = ''

  try {
    const [enrollmentsResponse, vehiclesResponse] = await Promise.all([
      api.get<Enrollment[]>('/user/enrollments'),
      api.get<Vehicle[]>('/user/vehicles'),
    ])
    enrollments.value = enrollmentsResponse.data
    vehicles.value = vehiclesResponse.data
  } catch (err) {
    error.value = extractErrorMessage(err, 'Error inesperado al cargar tu resumen.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)
</script>
