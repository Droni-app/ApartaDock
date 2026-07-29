<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-2 gap-3">
      <DuiLabel title="Periodo" required>
        <DuiSelect v-model="form.period" :options="periodOptions" size="lg" />
      </DuiLabel>
      <DuiLabel title="Año" required>
        <DuiInput v-model.number="form.periodYear" type="number" size="lg" block />
      </DuiLabel>
    </div>

    <DuiLabel title="Estado" required>
      <DuiSelect v-model="form.status" :options="statusOptions" size="lg" />
    </DuiLabel>

    <DuiLabel title="Autorizacion">
      <DuiInput v-model="form.authorization" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Poliza de seguro">
      <DuiInput v-model="form.insurancePolicy" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Revision tecnico-mecanica">
      <DuiInput v-model="form.technicalReview" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Agregar nota" help-text="El contenido se suma a las notas existentes, no las reemplaza.">
      <DuiTextarea v-model="form.notes" size="lg" block :rows="3" />
    </DuiLabel>

    <DuiAlert v-if="errorMessage" color="danger" variant="outline">
      {{ errorMessage }}
    </DuiAlert>

    <div class="flex justify-end gap-2 pt-2">
      <DuiButton type="button" variant="outline" color="neutral" :disabled="loading" @click="emit('cancel')">
        Cancelar
      </DuiButton>
      <DuiButton type="submit" color="primary" :loading="loading">
        Guardar cambios
      </DuiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { DuiAlert, DuiButton, DuiInput, DuiLabel, DuiSelect, DuiTextarea } from '@dronico/droni-kit'
import type { ParkingRequest } from '../../../types/parking_requests'

const props = withDefaults(
  defineProps<{
    parkingRequest?: ParkingRequest | null
    loading?: boolean
    errorMessage?: string
  }>(),
  {
    parkingRequest: null,
    loading: false,
    errorMessage: '',
  }
)

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>]
  cancel: []
}>()

const periodOptions = [
  { value: 'h1', label: 'H1' },
  { value: 'h2', label: 'H2' },
]

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'cancelled', label: 'Cancelada' },
]

const form = reactive({
  period: 'h2',
  periodYear: new Date().getFullYear(),
  status: 'pending',
  authorization: '',
  insurancePolicy: '',
  technicalReview: '',
  notes: '',
})

watch(
  () => props.parkingRequest,
  (parkingRequest) => {
    form.period = parkingRequest?.period ?? 'h2'
    form.periodYear = parkingRequest?.periodYear ?? new Date().getFullYear()
    form.status = parkingRequest?.status ?? 'pending'
    form.authorization = parkingRequest?.authorization ?? ''
    form.insurancePolicy = parkingRequest?.insurancePolicy ?? ''
    form.technicalReview = parkingRequest?.technicalReview ?? ''
    form.notes = ''
  },
  { immediate: true }
)

function handleSubmit() {
  const payload: Record<string, unknown> = {
    period: form.period,
    periodYear: form.periodYear,
    status: form.status,
    authorization: form.authorization.trim() || null,
    insurancePolicy: form.insurancePolicy.trim() || null,
    technicalReview: form.technicalReview.trim() || null,
  }

  if (form.notes.trim()) {
    payload.notes = form.notes.trim()
  }

  emit('submit', payload)
}
</script>
