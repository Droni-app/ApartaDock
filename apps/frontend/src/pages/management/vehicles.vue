<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Vehículos</h1>
        <p class="text-sm text-gray-500 dark:text-slate-400">Vehículos registrados a tu nombre.</p>
      </div>
      <div class="flex gap-2">
        <DuiButton variant="outline" color="neutral" to="/management">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Gestión
        </DuiButton>
        <DuiButton color="primary" @click="openCreateDrawer">
          <i class="mdi mdi-plus mr-1"></i>
          Registrar vehículo
        </DuiButton>
      </div>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500 dark:text-slate-400">Cargando...</p>

    <p v-else-if="!vehicles.length" class="text-sm text-gray-500 dark:text-slate-400">
      No tienes vehículos registrados.
    </p>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <DuiCard v-for="vehicle in vehicles" :key="vehicle.id">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <i :class="`mdi ${vehicleTypeIcon(vehicle.vehicleType)} text-3xl`"></i>
          </div>
          <div class="flex-1">
            <p class="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100">{{ vehicle.plate ?? 'Sin placa' }}</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">
              {{ vehicleTypeLabel(vehicle.vehicleType) }}
              <span v-if="vehicle.brand || vehicle.model"> - {{ vehicle.brand }} {{ vehicle.model }}</span>
              <span v-if="vehicle.color"> - {{ vehicle.color }}</span>
            </p>
          </div>
          <DuiBadge :color="vehicle.isOwner ? 'primary' : 'secondary'" variant="soft">
            {{ vehicle.isOwner ? 'Propietario' : 'No propietario' }}
          </DuiBadge>
        </div>

        <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
          <div>
            <dt class="text-xs uppercase text-gray-400 dark:text-slate-500">Propietario</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ vehicle.ownerName }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-400 dark:text-slate-500">Año</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ vehicle.year }}</dd>
          </div>
        </dl>

        <div class="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
          <DuiButton size="sm" variant="outline" color="primary" @click="openEditDrawer(vehicle)">
            Editar
          </DuiButton>
          <DuiButton size="sm" variant="ghost" color="danger" @click="openDeleteModal(vehicle)">
            Eliminar
          </DuiButton>
        </div>
      </DuiCard>
    </div>

    <Drawer v-model="showDrawer" :title="editingVehicle ? 'Editar vehiculo' : 'Registrar vehiculo'">
      <VehicleForm
        :mode="editingVehicle ? 'edit' : 'create'"
        :vehicle="editingVehicle"
        :loading="saving"
        :error-message="saveError"
        @submit="handleSubmit"
        @cancel="showDrawer = false"
      />
    </Drawer>

    <DuiModal v-model="showDeleteModal" title="Eliminar vehiculo" color="danger">
      <p class="text-sm text-slate-600">
        ¿Seguro que deseas eliminar el vehiculo <strong>{{ vehicleToDelete?.plate ?? 'sin placa' }}</strong>? Esta
        accion no se puede deshacer.
      </p>

      <DuiAlert v-if="deleteError" color="danger" variant="outline" class="mt-4">
        {{ deleteError }}
      </DuiAlert>

      <template #footer>
        <div class="flex justify-end gap-2">
          <DuiButton
            type="button"
            variant="outline"
            color="neutral"
            :disabled="deleting"
            @click="showDeleteModal = false"
          >
            Cancelar
          </DuiButton>
          <DuiButton type="button" color="danger" :loading="deleting" @click="handleDelete">
            Eliminar
          </DuiButton>
        </div>
      </template>
    </DuiModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiBadge, DuiButton, DuiCard, DuiModal } from '@dronico/droni-kit'
import { api } from '../../services/api'
import type { ApiErrorResponse } from '../../types/api'
import type { Vehicle } from '../../types/vehicles'
import Drawer from '../../components/admin/Drawer.vue'
import VehicleForm from '../../components/management/vehicles/Form.vue'

const vehicles = ref<Vehicle[]>([])
const loading = ref(false)
const error = ref('')

const showDrawer = ref(false)
const editingVehicle = ref<Vehicle | null>(null)
const saving = ref(false)
const saveError = ref('')

const showDeleteModal = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)
const deleting = ref(false)
const deleteError = ref('')

const vehicleTypeMeta: Record<string, { label: string; icon: string }> = {
  car: { label: 'Carro', icon: 'mdi-car-outline' },
  motorcycle: { label: 'Moto', icon: 'mdi-motorbike' },
  bicycle: { label: 'Bicicleta', icon: 'mdi-bike' },
  truck: { label: 'Camion', icon: 'mdi-truck-outline' },
  other: { label: 'Otro', icon: 'mdi-help-circle-outline' },
}

function vehicleTypeLabel(type: string) {
  return vehicleTypeMeta[type]?.label ?? type
}

function vehicleTypeIcon(type: string) {
  return vehicleTypeMeta[type]?.icon ?? 'mdi-car-outline'
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

async function fetchVehicles() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<Vehicle[]>('/user/vehicles')
    vehicles.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    vehicles.value = []
    error.value = extractErrorMessage(err, 'Error inesperado al cargar tus vehiculos.')
  } finally {
    loading.value = false
  }
}

function openCreateDrawer() {
  editingVehicle.value = null
  saveError.value = ''
  showDrawer.value = true
}

function openEditDrawer(vehicle: Vehicle) {
  editingVehicle.value = vehicle
  saveError.value = ''
  showDrawer.value = true
}

async function handleSubmit(payload: Record<string, unknown>) {
  saving.value = true
  saveError.value = ''

  try {
    if (editingVehicle.value) {
      await api.put(`/user/vehicles/${editingVehicle.value.id}`, payload)
    } else {
      await api.post('/user/vehicles', payload)
    }
    showDrawer.value = false
    await fetchVehicles()
  } catch (err) {
    saveError.value = extractErrorMessage(err, 'Error inesperado al guardar el vehiculo.')
  } finally {
    saving.value = false
  }
}

function openDeleteModal(vehicle: Vehicle) {
  vehicleToDelete.value = vehicle
  deleteError.value = ''
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!vehicleToDelete.value) {
    return
  }

  deleting.value = true
  deleteError.value = ''

  try {
    await api.delete(`/user/vehicles/${vehicleToDelete.value.id}`)
    showDeleteModal.value = false
    await fetchVehicles()
  } catch (err) {
    deleteError.value = extractErrorMessage(err, 'Error inesperado al eliminar el vehiculo.')
  } finally {
    deleting.value = false
  }
}

onMounted(fetchVehicles)
</script>
