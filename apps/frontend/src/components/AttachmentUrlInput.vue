<template>
  <div class="space-y-2">
    <DuiFile
      v-model="props.modelValue"
      :accept="props.accept"
      @open-browser="openBrowseModal"
      @upload-file="triggerUpload"
      @open-file="openFile"
    />
    <DuiAlert v-if="actionError" color="danger" variant="outline">
      {{ actionError }}
    </DuiAlert>

    <DuiModal
      v-model="showBrowseModal"
      :title="`Mis archivos (${props.visibility})`"
      size="lg"
      scrollable>
      <DuiAlert v-if="listError" color="danger" variant="outline" class="mb-3">
        {{ listError }}
      </DuiAlert>

      <p v-if="!loading && !attachments.length" class="text-sm text-gray-500 dark:text-slate-400">
        No tienes archivos cargados todavia.
      </p>

      <DuiTable
        v-else
        :loading="loading"
        :columns="columns"
        :rows="attachments"
        :pagination="tablePagination"
        @paginate="fetchAttachments"
      >
        <template #name="row">
          <div class="flex items-center gap-2">
            <i :class="`mdi ${iconForMime(row.mime)} text-lg text-gray-400 dark:text-slate-500`"></i>
            <span class="text-slate-900 dark:text-slate-100">{{ row.name }}</span>
          </div>
        </template>
        <template #size="row">
          {{ row.size }}
        </template>
        <template #createdAt="row">
          {{ row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-' }}
        </template>
        <template #actions="row">
          <DuiButton size="sm" color="primary" @click="selectAttachment(row)">
            Seleccionar
          </DuiButton>
        </template>
      </DuiTable>
    </DuiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiModal, DuiTable, DuiFile } from '@dronico/droni-kit'
import { api } from '../services/api'
import type { ApiErrorResponse, PaginatedResponse } from '../types/api'
import type { Attachment } from '../types/attachments'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    accept?: string
    visibility?: 'private' | 'public'
  }>(),
  {
    modelValue: null,
    accept: 'image/*,application/pdf',
    visibility: 'private',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const actionError = ref('')

const showBrowseModal = ref(false)
const attachments = ref<Attachment[]>([])
const loading = ref(false)
const listError = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)

const columns = [
  { name: 'name', label: 'Nombre' },
  { name: 'size', label: 'Tamano' },
  { name: 'createdAt', label: 'Fecha' },
  { name: 'actions', label: '' },
]

const tablePagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage.value,
  total: total.value,
}))

function extractErrorMessage(err: unknown, fallback: string) {
  const axiosError = err as AxiosError<ApiErrorResponse>
  const body = axiosError.response?.data
  return body?.errors?.[0]?.message ?? body?.message ?? (err instanceof Error ? err.message : fallback)
}

function iconForMime(mime: string | undefined) {
  if (mime?.startsWith('image/')) {
    return 'mdi-file-image-outline'
  }
  if (mime === 'application/pdf') {
    return 'mdi-file-pdf-box'
  }
  return 'mdi-file-outline'
}

async function fetchAttachments(page = 1) {
  loading.value = true
  listError.value = ''

  try {
    const response = await api.get<PaginatedResponse<Attachment>>('/user/attachments', {
      params: {
        page,
        per_page: perPage.value,
        visibility: props.visibility ?? 'private'
      },
    })
    const payload = response.data
    const records = Array.isArray(payload.data) ? payload.data : []

    attachments.value = records
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    total.value = payload.meta?.total ?? records.length
  } catch (err) {
    attachments.value = []
    total.value = 0
    listError.value = extractErrorMessage(err, 'Error inesperado al cargar tus archivos.')
  } finally {
    loading.value = false
  }
}

function openBrowseModal() {
  showBrowseModal.value = true
  fetchAttachments(1)
}

function selectAttachment(attachment: Attachment) {
  const url = props.visibility === 'public' ? attachment.url : attachment.path
  emit('update:modelValue', url)
  showBrowseModal.value = false
}

function triggerUpload(e: File) {
  // upload file multapart form data
  if (!e) {
    actionError.value = 'No se seleccionó ningún archivo.'
    return 
  }
  try {
    const file = e
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', file.name)
    formData.append('visibility', props.visibility ?? 'private')

    api.post('/user/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        fetchAttachments(currentPage.value)
        emit('update:modelValue', props.visibility === 'public' ? response.data.url : response.data.path)
      })
      .catch((err) => {
        actionError.value = extractErrorMessage(err, 'Error inesperado al subir el archivo.')
      })
  } catch (err) {
    actionError.value = extractErrorMessage(err, 'Error inesperado al subir el archivo.')
  }
}

function openFile(path:string) {
  // if  path starts with http or https, open in new tab
  if (path.startsWith('http://') || path.startsWith('https://')) {
    window.open(path, '_blank')
  } else {
    // otherwise, prepend api base url
    api.post('/user/attachments/download', { path })
      .then((response) => {
        const url = response.data.url
        window.open(url, '_blank')
      })
      .catch((err) => {
        console.error('Error downloading file:', err)
      })
  }
}

</script>
