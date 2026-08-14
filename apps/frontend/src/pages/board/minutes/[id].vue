<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div>
        <DuiButton variant="ghost" color="neutral" size="sm" to="/board/minutes">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Minutas
        </DuiButton>
        <h1 class="mt-2 text-2xl">Detalle de minuta</h1>
      </div>
      <DuiButton v-if="minute && canEdit" color="primary" @click="showDrawer = true">
        <i class="mdi mdi-pencil-outline mr-1"></i>
        Editar
      </DuiButton>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500">Cargando...</p>

    <DuiCard v-else-if="minute" :title="minute.name">
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs uppercase text-gray-500">Autor</dt>
          <dd class="text-slate-900">{{ minute.user?.fullName || minute.user?.email || '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Estado</dt>
          <dd>
            <DuiBadge :color="minute.active ? 'success' : 'neutral'" variant="soft">
              {{ minute.active ? 'Activa' : 'Inactiva' }}
            </DuiBadge>
          </dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Creada</dt>
          <dd class="text-slate-900">{{ formatDate(minute.createdAt) }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Actualizada</dt>
          <dd class="text-slate-900">{{ formatDate(minute.updatedAt) }}</dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-xs uppercase text-gray-500">Descripcion</dt>
          <dd class="text-slate-900">{{ minute.description || '-' }}</dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-xs uppercase text-gray-500">Documento</dt>
          <dd class="text-slate-900">
            <AttachmentOpen v-if="minute.document" :attachment="minute.document" class="inline-block" />
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="mb-1 text-xs uppercase text-gray-500">Contenido</dt>
          <dd
            v-if="minute.content"
            class="prose-sm text-slate-900 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            v-html="sanitizedContent"
          ></dd>
          <dd v-else class="text-slate-900">-</dd>
        </div>
      </dl>
    </DuiCard>

    <Drawer v-model="showDrawer" title="Editar minuta">
      <MinuteForm
        mode="edit"
        :minute="minute"
        :loading="saving"
        :error-message="saveError"
        @submit="handleSubmit"
        @cancel="showDrawer = false"
      />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AxiosError } from 'axios'
import { DuiAlert, DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import { getAuthUser } from '../../../composables/useAuth'
import type { ApiErrorResponse } from '../../../types/api'
import type { Minute } from '../../../types/minutes'
import { sanitizeHtml } from '../../../utils/sanitizeHtml'
import Drawer from '../../../components/admin/Drawer.vue'
import MinuteForm from '../../../components/board/minutes/Form.vue'
import AttachmentOpen from '../../../components/AttachmentOpen.vue'

const route = useRoute()
const minuteId = route.params.id as string

const minute = ref<Minute | null>(null)
const loading = ref(false)
const error = ref('')

const showDrawer = ref(false)
const saving = ref(false)
const saveError = ref('')

const canEdit = computed(() => minute.value?.userId === getAuthUser()?.id)
const sanitizedContent = computed(() => sanitizeHtml(minute.value?.content ?? ''))

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

async function fetchMinute() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<Minute>(`/board/minutes/${minuteId}`)
    minute.value = response.data
  } catch (err) {
    minute.value = null
    error.value = extractErrorMessage(err, 'Error inesperado al cargar la minuta.')
  } finally {
    loading.value = false
  }
}

async function handleSubmit(payload: Record<string, unknown>) {
  saving.value = true
  saveError.value = ''

  try {
    await api.put(`/board/minutes/${minuteId}`, payload)
    await fetchMinute()
    showDrawer.value = false
  } catch (err) {
    saveError.value = extractErrorMessage(err, 'Error inesperado al actualizar la minuta.')
  } finally {
    saving.value = false
  }
}

onMounted(fetchMinute)
</script>
