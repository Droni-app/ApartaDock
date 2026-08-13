<template>
  <form class="space-y-4" autocomplete="off" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-2 gap-3">
      <DuiLabel title="Tipo de vehiculo" required>
        <DuiSelect v-model="form.vehicleType" :options="vehicleTypeOptions" size="lg" />
      </DuiLabel>
      <DuiLabel title="Placa">
        <DuiInput v-model="form.plate" size="lg" block placeholder="Ej. ABC123" />
      </DuiLabel>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <DuiLabel title="Marca">
        <DuiInput v-model="form.brand" size="lg" block />
      </DuiLabel>
      <DuiLabel title="Modelo">
        <DuiInput v-model="form.model" size="lg" block />
      </DuiLabel>
      <DuiLabel title="Color">
        <DuiInput v-model="form.color" size="lg" block />
      </DuiLabel>
    </div>

    <DuiLabel title="Año" required>
      <DuiInput v-model.number="form.year" type="number" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Licencia de conduccion">
      <DuiInput v-model="form.driverLicense" size="lg" block />
    </DuiLabel>

    <DuiSwitch
      v-model="form.isOwner"
      label="Soy el propietario del vehiculo"
      description="Desactiva si el vehiculo pertenece a otra persona"
    />

    <DuiLabel title="Nombre del propietario" required>
      <DuiInput v-model="form.ownerName" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Documento del propietario" required>
      <DuiInput v-model="form.ownerDocument" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Tarjeta de propiedad" required help-text="Enlace a una foto o PDF de la tarjeta de propiedad.">
      <AttachmentUrlInput v-model="form.ownerCard" placeholder="https://..." />
    </DuiLabel>

    <DuiAlert v-if="errorMessage" color="danger" variant="outline">
      {{ errorMessage }}
    </DuiAlert>
    {{  form.ownerCard }}

    <div class="flex justify-end gap-2 pt-2">
      <DuiButton type="button" variant="outline" color="neutral" :disabled="loading" @click="emit('cancel')">
        Cancelar
      </DuiButton>
      <DuiButton type="submit" color="primary" :loading="loading">
        {{ mode === 'create' ? 'Registrar vehiculo' : 'Guardar cambios' }}
      </DuiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { DuiAlert, DuiButton, DuiInput, DuiLabel, DuiSelect, DuiSwitch } from '@dronico/droni-kit'
import { getAuthUser } from '../../../composables/useAuth'
import type { Vehicle } from '../../../types/vehicles'
import AttachmentUrlInput from '../../AttachmentUrlInput.vue'

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    vehicle?: Vehicle | null
    loading?: boolean
    errorMessage?: string
  }>(),
  {
    mode: 'create',
    vehicle: null,
    loading: false,
    errorMessage: '',
  }
)

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>]
  cancel: []
}>()

const vehicleTypeOptions = [
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Bicicleta' },
  { value: 'truck', label: 'Camion' },
  { value: 'other', label: 'Otro' },
]

const form = reactive({
  plate: '',
  vehicleType: 'car',
  brand: '',
  model: '',
  color: '',
  year: new Date().getFullYear(),
  driverLicense: '',
  isOwner: true,
  ownerName: '',
  ownerDocument: '',
  ownerCard: '',
})

watch(
  () => props.vehicle,
  (vehicle) => {
    form.plate = vehicle?.plate ?? ''
    form.vehicleType = vehicle?.vehicleType ?? 'car'
    form.brand = vehicle?.brand ?? ''
    form.model = vehicle?.model ?? ''
    form.color = vehicle?.color ?? ''
    form.year = vehicle?.year ?? new Date().getFullYear()
    form.driverLicense = vehicle?.driverLicense ?? ''
    form.isOwner = Boolean(vehicle?.isOwner ?? true)
    form.ownerName = vehicle?.ownerName ?? ''
    form.ownerDocument = vehicle?.ownerDocument ?? ''
    form.ownerCard = vehicle?.ownerCard ?? ''

    if (!vehicle && form.isOwner) {
      const authUser = getAuthUser()
      form.ownerName = authUser?.fullName ?? ''
      form.ownerDocument = authUser?.document ?? ''
    }
  },
  { immediate: true }
)

watch(
  () => form.isOwner,
  (isOwner) => {
    if (!isOwner || props.mode !== 'create') {
      return
    }
    const authUser = getAuthUser()
    if (!form.ownerName) {
      form.ownerName = authUser?.fullName ?? ''
    }
    if (!form.ownerDocument) {
      form.ownerDocument = authUser?.document ?? ''
    }
  }
)

function handleSubmit() {
  emit('submit', {
    plate: form.plate.trim() || null,
    vehicleType: form.vehicleType,
    brand: form.brand.trim() || null,
    model: form.model.trim() || null,
    color: form.color.trim() || null,
    year: form.year,
    driverLicense: form.driverLicense.trim() || null,
    isOwner: form.isOwner,
    ownerName: form.ownerName.trim(),
    ownerDocument: form.ownerDocument.trim(),
    ownerCard: form.ownerCard.trim(),
  })
}
</script>
