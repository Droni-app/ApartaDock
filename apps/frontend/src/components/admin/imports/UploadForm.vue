<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <DuiLabel title="Archivo JSON" required>
      <input
        ref="fileInputRef"
        type="file"
        accept=".json,application/json"
        class="block w-full cursor-pointer rounded-lg border border-gray-300 dark:border-slate-600 text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 dark:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiLabel } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'

const props = defineProps<{
  endpoint: string
}>()

const emit = defineEmits<{
  imported: [data: unknown]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] ?? null
}

async function handleSubmit() {
  if (!selectedFile.value) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await api.post(props.endpoint, formData)
    emit('imported', response.data)

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
