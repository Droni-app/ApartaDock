<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Vehículos"
      description="Vehículos registrados a tu nombre."
    >
      <DuiButton @click="openCreateDrawer">
        <i class="mdi mdi-plus" />
        Registrar vehículo
      </DuiButton>
    </UiTitlePage>
    <DuiDrawer v-model="showDrawer" :name="editingVehicle ? 'Editar vehículo' : 'Registrar vehículo'">
      <VehicleForm
        :mode="editingVehicle ? 'edit' : 'create'"
        :vehicle="editingVehicle"
        :loading="saving"
        @submit="storeVehicle"
        @delete="deleteVehicle"
        @cancel="showDrawer = false"
      />
    </DuiDrawer>
    <p v-if="!loading && !vehicles.length" class="text-sm text-gray-500 dark:text-slate-400">
      No tienes vehículos registrados.
    </p>
    <div class="md:grid grid-cols-3 gap-3">
      <UiVehiclesCard
        v-for="vehicle of vehicles"
        :key="vehicle.id"
        :vehicle="vehicle"
        class="mb-3"
        @edit="openEditDrawer" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UiTitlePage from '@/components/Ui/TitlePage.vue'
import { DuiButton, DuiDrawer, useToast } from '@dronico/droni-kit';
import { api } from '@/services/api'
import type { AxiosError } from 'axios';
import type { ValidationErrors } from '@/types/api.ts';
import type { Vehicle } from '@/types/vehicles.ts';
import UiVehiclesCard from '@/components/user/vehicles/Card.vue'
import VehicleForm from '@/components/user/vehicles/Form.vue'

const toast = useToast()

const loading = ref(false)
const saving = ref(false)
const showDrawer = ref(false)
const editingVehicle = ref<Vehicle | null>(null)
const vehicles = ref<Vehicle[]>([])

function getVehicles() {
  loading.value = true
  api.get<Vehicle[]>('/user/vehicles').then(res => {
    vehicles.value = res.data
  }).finally(() => {
    loading.value = false
  })
}

function openCreateDrawer() {
  editingVehicle.value = null
  showDrawer.value = true
}

function openEditDrawer(vehicle: Vehicle) {
  editingVehicle.value = vehicle
  showDrawer.value = true
}

function storeVehicle(payload: Record<string, unknown>) {
  if (saving.value) return;
  saving.value = true
  const request = editingVehicle.value
    ? api.put(`/user/vehicles/${editingVehicle.value.id}`, payload)
    : api.post('/user/vehicles', payload)

  request.then(() => {
    toast.success(`Vehículo ${editingVehicle.value ? 'actualizado' : 'registrado'} correctamente.`)
    getVehicles()
    showDrawer.value = false
  }).catch((e: AxiosError<ValidationErrors>) => {
    toast.error(
      e.response?.data?.errors ?
        e.response?.data.errors[0]?.message :
        'Se produjo un error al guardar el vehículo.'
    )
  }).finally(() => {
    saving.value = false
  })
}

function deleteVehicle() {
  if (!editingVehicle.value) return;
  api.delete(`/user/vehicles/${editingVehicle.value.id}`).then(() => {
    toast.success('Vehículo eliminado correctamente.')
    getVehicles()
    showDrawer.value = false
  }).catch(() => {
    toast.error('Se produjo un error al eliminar el vehículo.')
  })
}

onMounted(() => {
  getVehicles()
})
</script>
