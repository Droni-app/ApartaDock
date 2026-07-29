<template>
 <div>
  <div class="mb-4 flex items-center justify-between">
    <div>
      <h1 class="text-2xl">Minutas</h1>
      <small class="text-gray-500 block">
        Actas y minutas del consejo de administracion.
      </small>
    </div>
    <DuiButton color="primary" @click="openCreateDrawer">
      <i class="mdi mdi-plus mr-1"></i>
      Nueva minuta
    </DuiButton>
  </div>

  <DuiAlert v-if="error" color="danger" variant="outline">
    {{ error }}
  </DuiAlert>

  <DuiTable
    :loading="loading"
    :columns="columns"
    :rows="tableRows"
    :pagination="tablePagination"
    @paginate="handlePageChange"
  >
    <template #active="row">
      <DuiBadge :color="row.active ? 'success' : 'neutral'" variant="soft">
        {{ row.active ? 'Activa' : 'Inactiva' }}
      </DuiBadge>
    </template>
    <template #actions="row">
      <div class="flex justify-end gap-2">
        <DuiButton size="sm" variant="outline" :to="`/board/minutes/${row.id}`">
          Ver
        </DuiButton>
        <DuiButton v-if="canEdit(row)" size="sm" variant="outline" color="primary" @click="openEditDrawer(row)">
          Editar
        </DuiButton>
        <DuiButton v-if="isAdmin" size="sm" variant="ghost" color="danger" @click="openDeleteModal(row)">
          Eliminar
        </DuiButton>
      </div>
    </template>
  </DuiTable>

  <Drawer v-model="showDrawer" :title="editingMinute ? 'Editar minuta' : 'Nueva minuta'">
    <MinuteForm
      :mode="editingMinute ? 'edit' : 'create'"
      :minute="editingMinute"
      :loading="saving"
      :error-message="saveError"
      @submit="handleSubmit"
      @cancel="showDrawer = false"
    />
  </Drawer>

  <DuiModal v-model="showDeleteModal" title="Eliminar minuta" color="danger">
    <p class="text-sm text-slate-600">
      ¿Seguro que deseas eliminar la minuta <strong>{{ minuteToDelete?.name }}</strong>? Esta accion no se puede
      deshacer.
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
import { computed, onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiBadge, DuiButton, DuiModal, DuiTable } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import { getAuthUser } from '../../../composables/useAuth'
import type { ApiErrorResponse, PaginatedResponse } from '../../../types/api'
import type { Minute } from '../../../types/minutes'
import Drawer from '../../../components/admin/Drawer.vue'
import MinuteForm from '../../../components/board/minutes/Form.vue'

const minutes = ref<Minute[]>([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const currentPage = ref(1)
const perPage = ref(20)
const lastPage = ref(1)

const showDrawer = ref(false)
const editingMinute = ref<Minute | null>(null)
const saving = ref(false)
const saveError = ref('')

const showDeleteModal = ref(false)
const minuteToDelete = ref<Minute | null>(null)
const deleting = ref(false)
const deleteError = ref('')

const isAdmin = computed(() => getAuthUser()?.role === 'admin')

function canEdit(minute: Minute) {
  return minute.userId === getAuthUser()?.id
}

const columns = [
  { name: 'name', label: 'Nombre' },
  { name: 'authorName', label: 'Autor' },
  { name: 'active', label: 'Estado' },
  { name: 'createdAtLabel', label: 'Creada' },
  { name: 'actions', label: '' },
]

const totalItems = computed(() => total.value || minutes.value.length)
const tablePagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage.value,
  total: totalItems.value,
}))
const tableRows = computed(() =>
  minutes.value.map((minute) => ({
    ...minute,
    authorName: minute.user?.fullName || minute.user?.email || '-',
    createdAtLabel: formatDate(minute.createdAt),
  }))
)

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleDateString()
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

async function fetchMinutes(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<PaginatedResponse<Minute>>('/board/minutes', {
      params: { page, limit: perPage.value },
    })
    const payload = response.data
    const records = Array.isArray(payload.data) ? payload.data : []

    minutes.value = records
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    lastPage.value = payload.meta?.lastPage ?? 1
    total.value = payload.meta?.total ?? records.length
  } catch (err) {
    minutes.value = []
    lastPage.value = 1
    total.value = 0
    error.value = extractErrorMessage(err, 'Error inesperado al cargar las minutas.')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  fetchMinutes(page)
}

function openCreateDrawer() {
  editingMinute.value = null
  saveError.value = ''
  showDrawer.value = true
}

function openEditDrawer(minute: Minute) {
  editingMinute.value = minute
  saveError.value = ''
  showDrawer.value = true
}

async function handleSubmit(payload: Record<string, unknown>) {
  saving.value = true
  saveError.value = ''

  try {
    if (editingMinute.value) {
      await api.put(`/board/minutes/${editingMinute.value.id}`, payload)
    } else {
      await api.post('/board/minutes', payload)
    }
    showDrawer.value = false
    await fetchMinutes(editingMinute.value ? currentPage.value : 1)
  } catch (err) {
    saveError.value = extractErrorMessage(err, 'Error inesperado al guardar la minuta.')
  } finally {
    saving.value = false
  }
}

function openDeleteModal(minute: Minute) {
  minuteToDelete.value = minute
  deleteError.value = ''
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!minuteToDelete.value) {
    return
  }

  deleting.value = true
  deleteError.value = ''

  try {
    await api.delete(`/board/minutes/${minuteToDelete.value.id}`)
    showDeleteModal.value = false
    await fetchMinutes()
  } catch (err) {
    deleteError.value = extractErrorMessage(err, 'Error inesperado al eliminar la minuta.')
  } finally {
    deleting.value = false
  }
}

onMounted(fetchMinutes)
</script>
