<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl">Imports</h1>
      <small class="text-gray-500 dark:text-slate-400 block">
        Importacion de datos masivos desde archivos.
      </small>
    </div>

    <DuiCard title="Solicitudes de parqueo" subtitle="Importa un archivo JSON con solicitudes de parqueo.">
      <UploadForm endpoint="/admin/imports/parking-requests" @imported="handleParkingRequestsImported" />

      <div v-if="parkingRequestResult" class="mt-6 space-y-4 border-t border-gray-200 dark:border-slate-700 pt-4">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ parkingRequestResult.total }}</p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Total</p>
          </div>
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ parkingRequestResult.processed }}</p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Procesados</p>
          </div>
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p
              class="text-2xl font-semibold"
              :class="parkingRequestResult.errors.length ? 'text-red-600' : 'text-slate-900 dark:text-slate-100'"
            >
              {{ parkingRequestResult.errors.length }}
            </p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Errores</p>
          </div>
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ parkingRequestResult.parkingRequests.created }}</p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Solicitudes creadas</p>
          </div>
        </div>

        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Usuarios</dt>
            <dd class="text-slate-900 dark:text-slate-100">
              {{ parkingRequestResult.users.created }} creados, {{ parkingRequestResult.users.updated }} actualizados
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Vehiculos</dt>
            <dd class="text-slate-900 dark:text-slate-100">
              {{ parkingRequestResult.vehicles.created }} creados, {{ parkingRequestResult.vehicles.updated }} actualizados
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500 dark:text-slate-400">Enrollments</dt>
            <dd class="text-slate-900 dark:text-slate-100">
              {{ parkingRequestResult.enrollments.created }} creados, {{ parkingRequestResult.enrollments.updated }} actualizados
            </dd>
          </div>
        </dl>

        <ImportErrorsList :errors="parkingRequestResult.errors" />
      </div>
    </DuiCard>

    <DuiCard title="Detalles de unidades" subtitle="Importa deuda y notas de las unidades desde un archivo JSON.">
      <UploadForm endpoint="/admin/imports/units" @imported="handleUnitsImported" />

      <div v-if="unitResult" class="mt-6 space-y-4 border-t border-gray-200 dark:border-slate-700 pt-4">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ unitResult.total }}</p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Total</p>
          </div>
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ unitResult.processed }}</p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Procesados</p>
          </div>
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p class="text-2xl font-semibold" :class="unitResult.errors.length ? 'text-red-600' : 'text-slate-900 dark:text-slate-100'">
              {{ unitResult.errors.length }}
            </p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Errores</p>
          </div>
          <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ unitResult.units.updated }}</p>
            <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Unidades actualizadas</p>
          </div>
        </div>

        <ImportErrorsList :errors="unitResult.errors" />
      </div>
    </DuiCard>

    <DuiCard
      title="Rechazo automatico por cartera"
      subtitle="Rechaza todas las solicitudes de parqueo pendientes cuya unidad tenga cartera mayor al umbral."
    >
      <div class="flex items-end gap-3">
        <DuiLabel title="Umbral de cartera" class="max-w-xs">
          <DuiInput v-model.number="debtThreshold" type="number" block />
        </DuiLabel>
        <DuiButton color="danger" @click="showRejectModal = true">
          <i class="mdi mdi-cancel mr-1"></i>
          Rechazar solicitudes
        </DuiButton>
      </div>

      <DuiAlert v-if="rejectError" color="danger" variant="outline" class="mt-4">
        {{ rejectError }}
      </DuiAlert>

      <div v-if="rejectResult" class="mt-6 grid grid-cols-2 gap-3 border-t border-gray-200 dark:border-slate-700 pt-4 sm:grid-cols-2">
        <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
          <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ formatCurrency(rejectResult.threshold) }}</p>
          <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Umbral aplicado</p>
        </div>
        <div class="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
          <p class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ rejectResult.updated }}</p>
          <p class="text-xs uppercase text-gray-500 dark:text-slate-400">Solicitudes rechazadas</p>
        </div>
      </div>
    </DuiCard>

    <DuiModal v-model="showRejectModal" title="Rechazar solicitudes por cartera" color="danger">
      <p class="text-sm text-slate-600">
        Vas a rechazar automaticamente todas las solicitudes de parqueo pendientes cuya unidad tenga una cartera
        mayor a <strong>{{ formatCurrency(debtThreshold) }}</strong>. Esta accion no se puede deshacer. ¿Continuar?
      </p>

      <template #footer>
        <div class="flex justify-end gap-2">
          <DuiButton
            type="button"
            variant="outline"
            color="neutral"
            :disabled="rejecting"
            @click="showRejectModal = false"
          >
            Cancelar
          </DuiButton>
          <DuiButton type="button" color="danger" :loading="rejecting" @click="handleRejectByDebt">
            Rechazar solicitudes
          </DuiButton>
        </div>
      </template>
    </DuiModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiCard, DuiInput, DuiLabel, DuiModal } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'
import type { ParkingRequestImportResult, RejectByDebtResult, UnitDetailsImportResult } from '../../../types/imports'
import UploadForm from '../../../components/admin/imports/UploadForm.vue'
import ImportErrorsList from '../../../components/admin/imports/ErrorsList.vue'

const parkingRequestResult = ref<ParkingRequestImportResult | null>(null)
const unitResult = ref<UnitDetailsImportResult | null>(null)

function handleParkingRequestsImported(data: unknown) {
  parkingRequestResult.value = data as ParkingRequestImportResult
}

function handleUnitsImported(data: unknown) {
  unitResult.value = data as UnitDetailsImportResult
}

const debtThreshold = ref(150000)
const showRejectModal = ref(false)
const rejecting = ref(false)
const rejectError = ref('')
const rejectResult = ref<RejectByDebtResult | null>(null)

function formatCurrency(value: number) {
  return `$${value.toLocaleString('es-CO')}`
}

async function handleRejectByDebt() {
  rejecting.value = true
  rejectError.value = ''

  try {
    const response = await api.post<RejectByDebtResult>('/board/parking-requests/reject-by-debt', null, {
      params: { debt_threshold: debtThreshold.value },
    })
    rejectResult.value = response.data
    showRejectModal.value = false
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    rejectError.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al rechazar las solicitudes.')
  } finally {
    rejecting.value = false
  }
}
</script>
