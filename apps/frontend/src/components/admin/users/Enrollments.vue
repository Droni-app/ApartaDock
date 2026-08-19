<template>
  <DuiCard>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Unidades inscritas</h2>
      <DuiButton size="sm" color="primary" @click="openDrawer">
        <i class="mdi mdi-home-plus-outline mr-1"></i>
        Agregar unidad
      </DuiButton>
    </div>

    <p v-if="!localEnrollments.length" class="text-sm text-gray-500 dark:text-slate-400">
      Este usuario no tiene unidades inscritas.
    </p>

    <ul v-else class="divide-y divide-gray-200 dark:divide-slate-700 rounded-lg border border-gray-200 dark:border-slate-700">
      <li
        v-for="enrollment in localEnrollments"
        :key="enrollment.id"
        class="flex items-center justify-between px-4 py-3"
      >
        <div>
          <p class="font-medium text-slate-900 dark:text-slate-100">
            {{ enrollment.unit?.name ?? 'Unidad eliminada' }}
          </p>
          <p v-if="enrollment.unit" class="text-sm text-gray-500 dark:text-slate-400">
            Torre {{ enrollment.unit.tower }} - Apto {{ enrollment.unit.apto }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <DuiBadge color="primary" variant="soft">{{ roleLabel(enrollment.role) }}</DuiBadge>
          <DuiButton
            size="sm"
            variant="ghost"
            color="danger"
            title="Eliminar unidad"
            @click="openDeleteModal(enrollment)"
          >
            <i class="mdi mdi-trash-can-outline"></i>
          </DuiButton>
        </div>
      </li>
    </ul>

    <Drawer v-model="showDrawer" title="Nueva unidad inscrita">
      <div class="space-y-4">
        <template v-if="!selectedUnit">
          <form class="flex gap-2" @submit.prevent="handleSearch">
            <DuiInput v-model="searchQuery" placeholder="Buscar unidad por nombre..." block />
            <DuiButton type="submit" variant="outline" color="neutral">
              <i class="mdi mdi-magnify"></i>
            </DuiButton>
          </form>

          <DuiAlert v-if="searchError" color="danger" variant="outline">
            {{ searchError }}
          </DuiAlert>

          <p v-if="searching" class="text-sm text-gray-500 dark:text-slate-400">Buscando...</p>
          <p v-else-if="searched && !searchResults.length" class="text-sm text-gray-500 dark:text-slate-400">
            No se encontraron unidades.
          </p>

          <ul v-if="searchResults.length" class="divide-y divide-gray-200 dark:divide-slate-700 rounded-lg border border-gray-200 dark:border-slate-700">
            <li
              v-for="unit in searchResults"
              :key="unit.id"
              class="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p class="font-medium text-slate-900 dark:text-slate-100">{{ unit.name }}</p>
                <p class="text-sm text-gray-500 dark:text-slate-400">Torre {{ unit.tower }} - Apto {{ unit.apto }}</p>
              </div>
              <DuiButton size="sm" variant="outline" @click="selectUnit(unit)">
                Seleccionar
              </DuiButton>
            </li>
          </ul>
        </template>

        <template v-else>
          <div class="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4">
            <div>
              <p class="font-medium text-slate-900 dark:text-slate-100">{{ selectedUnit.name }}</p>
              <p class="text-sm text-gray-500 dark:text-slate-400">
                Torre {{ selectedUnit.tower }} - Apto {{ selectedUnit.apto }}
              </p>
            </div>
            <DuiButton size="sm" variant="ghost" color="neutral" @click="selectedUnit = null">
              Cambiar
            </DuiButton>
          </div>

          <DuiLabel title="Rol" required>
            <DuiSelect v-model="role" :options="roleOptions" size="lg" />
          </DuiLabel>

          <DuiAlert v-if="createError" color="danger" variant="outline">
            {{ createError }}
          </DuiAlert>

          <div class="flex justify-end gap-2 pt-2">
            <DuiButton
              type="button"
              variant="outline"
              color="neutral"
              :disabled="creating"
              @click="showDrawer = false"
            >
              Cancelar
            </DuiButton>
            <DuiButton type="button" color="primary" :loading="creating" @click="handleCreate">
              Crear inscripción
            </DuiButton>
          </div>
        </template>
      </div>
    </Drawer>

    <DuiModal v-model="showDeleteModal" title="Eliminar unidad inscrita" color="danger">
      <p class="text-sm text-slate-600">
        ¿Seguro que deseas eliminar la inscripción de la unidad
        <strong>{{ enrollmentToDelete?.unit?.name }}</strong>
        como {{ roleLabel(enrollmentToDelete?.role ?? '') }}? Esta accion no se puede deshacer.
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
  </DuiCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { AxiosError } from 'axios'
import {
  DuiCard,
  DuiAlert,
  DuiBadge,
  DuiButton,
  DuiInput,
  DuiLabel,
  DuiModal,
  DuiSelect,
} from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse, PaginatedResponse } from '../../../types/api'
import type { Enrollment, EnrollmentRole } from '../../../types/enrollments'
import type { Unit } from '../../../types/units'
import Drawer from '../Drawer.vue'

const props = withDefaults(
  defineProps<{
    userId: number
    enrollments?: Enrollment[]
  }>(),
  {
    enrollments: () => [],
  }
)

const localEnrollments = ref<Enrollment[]>([...props.enrollments])
watch(
  () => props.enrollments,
  (value) => {
    localEnrollments.value = [...value]
  }
)

const roleOptions: Array<{ value: EnrollmentRole; label: string }> = [
  { value: 'owner', label: 'Propietario' },
  { value: 'tenant', label: 'Arrendatario' },
  { value: 'resident', label: 'Residente' },
]

function roleLabel(role: string) {
  return roleOptions.find((option) => option.value === role)?.label ?? role
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

const showDrawer = ref(false)
const searchQuery = ref('')
const searching = ref(false)
const searched = ref(false)
const searchError = ref('')
const searchResults = ref<Unit[]>([])
const selectedUnit = ref<Unit | null>(null)
const role = ref<EnrollmentRole>('resident')
const creating = ref(false)
const createError = ref('')

function openDrawer() {
  searchQuery.value = ''
  searching.value = false
  searched.value = false
  searchError.value = ''
  searchResults.value = []
  selectedUnit.value = null
  role.value = 'resident'
  creating.value = false
  createError.value = ''
  showDrawer.value = true
}

async function handleSearch() {
  searching.value = true
  searchError.value = ''

  try {
    const response = await api.get<PaginatedResponse<Unit>>('/admin/units', {
      params: { q: searchQuery.value || undefined, limit: 10 },
    })
    searchResults.value = Array.isArray(response.data.data) ? response.data.data : []
  } catch (err) {
    searchResults.value = []
    searchError.value = extractErrorMessage(err, 'Error inesperado al buscar unidades.')
  } finally {
    searching.value = false
    searched.value = true
  }
}

function selectUnit(unit: Unit) {
  selectedUnit.value = unit
}

async function handleCreate() {
  if (!selectedUnit.value) {
    return
  }

  creating.value = true
  createError.value = ''

  try {
    const response = await api.post<Enrollment>('/admin/enrollments', {
      userId: props.userId,
      unitId: selectedUnit.value.id,
      role: role.value,
    })
    localEnrollments.value = [
      ...localEnrollments.value,
      { ...response.data, unit: selectedUnit.value },
    ]
    showDrawer.value = false
  } catch (err) {
    createError.value = extractErrorMessage(err, 'Error inesperado al crear el enrollment.')
  } finally {
    creating.value = false
  }
}

const showDeleteModal = ref(false)
const enrollmentToDelete = ref<Enrollment | null>(null)
const deleting = ref(false)
const deleteError = ref('')

function openDeleteModal(enrollment: Enrollment) {
  enrollmentToDelete.value = enrollment
  deleteError.value = ''
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!enrollmentToDelete.value) {
    return
  }

  deleting.value = true
  deleteError.value = ''

  try {
    await api.delete(`/admin/enrollments/${enrollmentToDelete.value.id}`)
    localEnrollments.value = localEnrollments.value.filter(
      (enrollment) => enrollment.id !== enrollmentToDelete.value?.id
    )
    showDeleteModal.value = false
  } catch (err) {
    deleteError.value = extractErrorMessage(err, 'Error inesperado al eliminar el enrollment.')
  } finally {
    deleting.value = false
  }
}
</script>
