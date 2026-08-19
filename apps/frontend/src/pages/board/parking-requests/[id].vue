<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div>
        <DuiButton variant="ghost" color="neutral" size="sm" to="/board/parking-requests">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Volver
        </DuiButton>
        <h1 class="mt-2 text-2xl">Detalle de solicitud de parqueo</h1>
      </div>
      <DuiButton v-if="parkingRequest" color="primary" @click="showEditDrawer = true">
        <i class="mdi mdi-pencil-outline mr-1"></i>
        Editar
      </DuiButton>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500 dark:text-slate-400">Cargando...</p>

    <div v-else-if="parkingRequest" class="space-y-6">
      <DuiCard title="Solicitud">
        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Periodo</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.period.toUpperCase() }} {{ parkingRequest.periodYear }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Estado</dt>
            <dd>
              <DuiBadge :color="statusColor(parkingRequest.status)" variant="soft">
                {{ statusLabel(parkingRequest.status) }}
              </DuiBadge>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Autorizacion</dt>
            <dd class="text-slate-900 dark:text-slate-100 break-words">{{ parkingRequest.authorization ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Poliza de seguro</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.insurancePolicy ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Revision tecnico-mecanica</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.technicalReview ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Creada</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ formatDate(parkingRequest.createdAt) }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Notas</dt>
            <dd class="whitespace-pre-line text-slate-900 dark:text-slate-100">{{ parkingRequest.notes || '-' }}</dd>
          </div>
        </dl>
      </DuiCard>

      <DuiCard title="Unidad">
        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Nombre</dt>
            <dd class="text-slate-900 dark:text-slate-100">
              <RouterLink class="text-primary-600 hover:underline" :to="`/admin/units/${parkingRequest.unit?.id}`">
                {{ parkingRequest.unit?.name ?? '-' }}
              </RouterLink>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Estado de la unidad</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.unit?.status ?? '-' }}</dd>
          </div>
        </dl>
      </DuiCard>

      <DuiCard title="Usuario">
        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Nombre</dt>
            <dd class="text-slate-900 dark:text-slate-100">
              <RouterLink class="text-primary-600 hover:underline" :to="`/admin/users/${parkingRequest.user?.id}`">
                {{ parkingRequest.user?.fullName || parkingRequest.user?.email || '-' }}
              </RouterLink>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Correo</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.user?.email ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Telefono</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.user?.phone ?? '-' }}</dd>
          </div>
        </dl>
      </DuiCard>

      <DuiCard title="Vehiculo">
        <dl v-if="parkingRequest.vehicle" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Placa</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.vehicle.plate ?? '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Tipo</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ vehicleTypeLabel(parkingRequest.vehicle.vehicleType) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Propietario del vehiculo</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.vehicle.ownerName }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Es propietario</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ parkingRequest.vehicle.isOwner ? 'Si' : 'No' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Tarjeta de propiedad</dt>
            <dd class="text-slate-900 dark:text-slate-100">
              <AttachmentOpen
                v-if="parkingRequest.vehicle.ownerCard"
                :attachment="parkingRequest.vehicle.ownerCard"
                class="inline-block" />
            </dd>
          </div>
        </dl>
        <p v-else class="text-sm text-gray-500 dark:text-slate-400">Esta solicitud no tiene un vehiculo asociado.</p>
      </DuiCard>
    </div>

    <Drawer v-model="showEditDrawer" title="Editar solicitud de parqueo">
      <ParkingRequestForm
        :parking-request="parkingRequest"
        :loading="saving"
        :error-message="saveError"
        @submit="handleUpdate"
        @cancel="showEditDrawer = false"
      />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AxiosError } from 'axios'
import { DuiAlert, DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'
import type { ParkingRequest } from '../../../types/parking_requests'
import Drawer from '../../../components/admin/Drawer.vue'
import ParkingRequestForm from '../../../components/board/parking-requests/Form.vue'
import AttachmentOpen from '../../../components/AttachmentOpen.vue'

const route = useRoute()
const parkingRequestId = route.params.id as string

const parkingRequest = ref<ParkingRequest | null>(null)
const loading = ref(false)
const error = ref('')

const showEditDrawer = ref(false)
const saving = ref(false)
const saveError = ref('')

type BadgeColor = 'primary' | 'neutral' | 'secondary' | 'success' | 'danger' | 'warning'

const statusOptions: Array<{ value: string; label: string; color: BadgeColor }> = [
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

function statusLabel(status: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

function statusColor(status: string): BadgeColor {
  return statusOptions.find((option) => option.value === status)?.color ?? 'neutral'
}

function vehicleTypeLabel(type: string) {
  return vehicleTypeOptions[type] ?? type
}

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString()
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

async function fetchParkingRequest() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<ParkingRequest>(`/board/parking-requests/${parkingRequestId}`)
    parkingRequest.value = response.data
  } catch (err) {
    parkingRequest.value = null
    error.value = extractErrorMessage(err, 'Error inesperado al cargar la solicitud de parqueo.')
  } finally {
    loading.value = false
  }
}

async function handleUpdate(payload: Record<string, unknown>) {
  saving.value = true
  saveError.value = ''

  try {
    await api.put<ParkingRequest>(`/board/parking-requests/${parkingRequestId}`, payload)
    await fetchParkingRequest()
    showEditDrawer.value = false
  } catch (err) {
    saveError.value = extractErrorMessage(err, 'Error inesperado al actualizar la solicitud de parqueo.')
  } finally {
    saving.value = false
  }
}

onMounted(fetchParkingRequest)
</script>
