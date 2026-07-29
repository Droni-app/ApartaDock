<template>
  <div>
    <h1 class="text-2xl">Imports</h1>
    <small class="text-gray-500 mb-4 block">
      Importacion de datos masivos desde archivos.
    </small>

    <DuiCard title="Solicitudes de parqueo" subtitle="Importa un archivo JSON con solicitudes de parqueo.">
      <form class="space-y-4" @submit.prevent="handleImport">
        <DuiLabel title="Archivo JSON" required>
          <input
            ref="fileInputRef"
            type="file"
            accept=".json,application/json"
            class="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            @change="handleFileChange"
          />
        </DuiLabel>

        <DuiAlert v-if="error" color="danger" variant="outline">
          {{ error }}
        </DuiAlert>

        <div class="flex justify-end">
          <DuiButton type="submit" color="primary" :loading="loading" :disabled="!selectedFile">
            <i class="mdi mdi-upload mr-1"></i>
            Importar
          </DuiButton>
        </div>
      </form>

      <div v-if="result" class="mt-6 space-y-4 border-t border-gray-200 pt-4">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-lg bg-slate-50 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900">{{ result.total }}</p>
            <p class="text-xs uppercase text-gray-500">Total</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900">{{ result.processed }}</p>
            <p class="text-xs uppercase text-gray-500">Procesados</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-3 text-center">
            <p class="text-2xl font-semibold" :class="result.errors.length ? 'text-red-600' : 'text-slate-900'">
              {{ result.errors.length }}
            </p>
            <p class="text-xs uppercase text-gray-500">Errores</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-3 text-center">
            <p class="text-2xl font-semibold text-slate-900">{{ result.parkingRequests.created }}</p>
            <p class="text-xs uppercase text-gray-500">Solicitudes creadas</p>
          </div>
        </div>

        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt class="text-xs uppercase text-gray-500">Usuarios</dt>
            <dd class="text-slate-900">{{ result.users.created }} creados, {{ result.users.updated }} actualizados</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500">Vehiculos</dt>
            <dd class="text-slate-900">{{ result.vehicles.created }} creados, {{ result.vehicles.updated }} actualizados</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-500">Enrollments</dt>
            <dd class="text-slate-900">
              {{ result.enrollments.created }} creados, {{ result.enrollments.updated }} actualizados
            </dd>
          </div>
        </dl>

        <div v-if="result.errors.length">
          <p class="mb-2 text-sm font-medium text-slate-900">Filas con errores</p>
          <ul class="max-h-64 divide-y divide-gray-200 overflow-y-auto rounded-lg border border-gray-200">
            <li v-for="importError in result.errors" :key="importError.index" class="px-4 py-2 text-sm">
              <span class="font-medium text-slate-900">Fila {{ importError.index + 1 }} ({{ importError.row }}):</span>
              <span class="text-red-600"> {{ importError.message }}</span>
            </li>
          </ul>
        </div>
      </div>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiCard, DuiLabel } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'
import type { ParkingRequestImportResult } from '../../../types/imports'

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const result = ref<ParkingRequestImportResult | null>(null)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] ?? null
}

async function handleImport() {
  if (!selectedFile.value) {
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await api.post<ParkingRequestImportResult>('/admin/imports/parking-requests', formData)
    result.value = response.data

    selectedFile.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al importar el archivo.')
  } finally {
    loading.value = false
  }
}
</script>
