<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Detalle de unidad"
      description="Unidades donde figuras como propietario, arrendatario o residente."
    />

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500 dark:text-slate-400">Cargando...</p>

    <div v-else-if="enrollment" class="space-y-6">
      <DuiCard title="Informacion de la unidad">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-lg font-semibold text-slate-900 dark:text-slate-100">Unidad {{ enrollment.unit?.name ?? '-' }}</p>
          <DuiBadge :color="roleColor(enrollment.role)" variant="soft">{{ roleLabel(enrollment.role) }}</DuiBadge>
        </div>

        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Torre</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.tower ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Piso</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.floor ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Apto</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.apto ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Área privada</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.privateArea ?? '-' }} m²</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Área construida</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.buildArea ?? '-' }} m²</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Coeficiente</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.coefficient ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Estado</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.status ?? '-' }}</dd>
          </div>
          <div class="sm:col-span-2 lg:col-span-3">
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Notas</dt>
            <dd class="whitespace-pre-line text-slate-900 dark:text-slate-100">{{ enrollment.unit?.notes || '-' }}</dd>
          </div>
        </dl>
      </DuiCard>

      <DuiCard title="Solicitudes de parqueo" subtitle="Solicitudes asociadas a esta unidad">
        <p v-if="!enrollment.parkingRequests.length" class="text-sm text-gray-500 dark:text-slate-400">
          No tienes solicitudes de parqueo registradas para esta unidad.
        </p>
        <ul v-else class="divide-y divide-gray-200 dark:divide-slate-700 rounded-lg border border-gray-200 dark:border-slate-700">
          <li v-for="parkingRequest in enrollment.parkingRequests" :key="parkingRequest.id" class="p-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="font-medium text-slate-900 dark:text-slate-100">
                  {{ parkingRequest.period.toUpperCase() }} {{ parkingRequest.periodYear }}
                  <span v-if="parkingRequest.vehicle" class="text-gray-500 dark:text-slate-400">
                    - {{ vehicleTypeLabel(parkingRequest.vehicle.vehicleType) }} {{ parkingRequest.vehicle.plate }}
                  </span>
                </p>
                <p class="text-sm text-gray-500 dark:text-slate-400">{{ formatDate(parkingRequest.createdAt) }}</p>
              </div>
              <DuiBadge :color="statusColor(parkingRequest.status)" variant="soft">
                {{ statusLabel(parkingRequest.status) }}
              </DuiBadge>
            </div>
            <p v-if="parkingRequest.notes" class="mt-2 whitespace-pre-line text-sm text-gray-600 dark:text-slate-300">
              {{ parkingRequest.notes }}
            </p>
          </li>
        </ul>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AxiosError } from 'axios'
import { DuiAlert, DuiBadge, DuiCard } from '@dronico/droni-kit'
import { api } from '@/services/api'
import type { ApiErrorResponse } from '@/types/api'
import type { EnrollmentDetail } from '../../../types/enrollments'
import UiTitlePage from '../../../components/Ui/TitlePage.vue'

const route = useRoute()
const enrollmentId = route.params.id as string

const enrollment = ref<EnrollmentDetail | null>(null)
const loading = ref(false)
const error = ref('')

const roleOptions: Array<{ value: string; label: string; color: 'primary' | 'secondary' | 'neutral' }> = [
  { value: 'owner', label: 'Propietario', color: 'primary' },
  { value: 'tenant', label: 'Arrendatario', color: 'secondary' },
  { value: 'resident', label: 'Residente', color: 'neutral' },
]

const statusOptions: Array<{ value: string; label: string; color: 'warning' | 'success' | 'danger' | 'neutral' }> = [
  { value: 'pending', label: 'Pendiente', color: 'warning' },
  { value: 'approved', label: 'Aprobada', color: 'success' },
  { value: 'rejected', label: 'Rechazada', color: 'danger' },
  { value: 'cancelled', label: 'Cancelada', color: 'neutral' },
]

const vehicleTypeOptions: Record<string, string> = {
  car: 'Carro',
  motorcycle: 'Moto',
  bicycle: 'Bicicleta',
  truck: 'Camion',
  other: 'Otro',
}

function roleLabel(role: string) {
  return roleOptions.find((option) => option.value === role)?.label ?? role
}

function roleColor(role: string) {
  return roleOptions.find((option) => option.value === role)?.color ?? 'neutral'
}

function statusLabel(status: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

function statusColor(status: string) {
  return statusOptions.find((option) => option.value === status)?.color ?? 'neutral'
}

function vehicleTypeLabel(type: string) {
  return vehicleTypeOptions[type] ?? type
}


function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleDateString()
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

async function fetchEnrollment() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<EnrollmentDetail>(`/user/enrollments/${enrollmentId}`)
    enrollment.value = response.data
  } catch (err) {
    enrollment.value = null
    error.value = extractErrorMessage(err, 'Error inesperado al cargar la unidad.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchEnrollment)
</script>
