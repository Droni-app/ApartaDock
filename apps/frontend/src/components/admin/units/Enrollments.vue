<template>
  <DuiCard>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Usuarios inscritos</h2>
      <DuiButton size="sm" color="primary" @click="openDrawer">
        <i class="mdi mdi-account-plus-outline mr-1"></i>
        Agregar usuario
      </DuiButton>
    </div>

    <p v-if="!localEnrollments.length" class="text-sm text-gray-500 dark:text-slate-400">
      Esta unidad no tiene usuarios registrados.
    </p>

    <ul v-else class="divide-y divide-gray-200 dark:divide-slate-700 rounded-lg border border-gray-200 dark:border-slate-700">
      <li
        v-for="enrollment in localEnrollments"
        :key="enrollment.id"
        class="flex items-center justify-between px-4 py-3"
      >
        <div>
          <p class="font-medium text-slate-900 dark:text-slate-100">
            {{ enrollment.user?.fullName || enrollment.user?.email || 'Usuario eliminado' }}
          </p>
          <p v-if="enrollment.user?.email" class="text-sm text-gray-500 dark:text-slate-400">
            {{ enrollment.user.email }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <DuiBadge color="primary" variant="soft">{{ roleLabel(enrollment.role) }}</DuiBadge>
          <DuiButton
            size="sm"
            variant="ghost"
            color="danger"
            title="Eliminar usuario"
            @click="openDeleteModal(enrollment)"
          >
            <i class="mdi mdi-trash-can-outline"></i>
          </DuiButton>
        </div>
      </li>
    </ul>

    <Drawer v-model="showDrawer" title="Nuevo usuario inscrito">
      <div class="space-y-4">
        <template v-if="!selectedUser">
          <form class="flex gap-2" @submit.prevent="handleSearch">
            <DuiInput
              v-model="searchQuery"
              placeholder="Buscar usuario por nombre, documento o correo..."
              block
            />
            <DuiButton type="submit" variant="outline" color="neutral">
              <i class="mdi mdi-magnify"></i>
            </DuiButton>
          </form>

          <DuiAlert v-if="searchError" color="danger" variant="outline">
            {{ searchError }}
          </DuiAlert>

          <p v-if="searching" class="text-sm text-gray-500 dark:text-slate-400">Buscando...</p>
          <p v-else-if="searched && !searchResults.length" class="text-sm text-gray-500 dark:text-slate-400">
            No se encontraron usuarios.
          </p>

          <ul v-if="searchResults.length" class="divide-y divide-gray-200 dark:divide-slate-700 rounded-lg border border-gray-200 dark:border-slate-700">
            <li
              v-for="user in searchResults"
              :key="user.id"
              class="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p class="font-medium text-slate-900 dark:text-slate-100">{{ user.fullName || user.email }}</p>
                <p class="text-sm text-gray-500 dark:text-slate-400">{{ user.email }}</p>
              </div>
              <DuiButton size="sm" variant="outline" @click="selectUser(user)">
                Seleccionar
              </DuiButton>
            </li>
          </ul>
        </template>

        <template v-else>
          <div class="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4">
            <div>
              <p class="font-medium text-slate-900 dark:text-slate-100">
                {{ selectedUser.fullName || selectedUser.email }}
              </p>
              <p class="text-sm text-gray-500 dark:text-slate-400">{{ selectedUser.email }}</p>
            </div>
            <DuiButton size="sm" variant="ghost" color="neutral" @click="selectedUser = null">
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
              Crear usuario inscrito
            </DuiButton>
          </div>
        </template>
      </div>
    </Drawer>

    <DuiModal v-model="showDeleteModal" title="Eliminar enrollment" color="danger">
      <p class="text-sm text-slate-600">
        ¿Seguro que deseas eliminar el enrollment de
        <strong>{{ enrollmentToDelete?.user?.fullName || enrollmentToDelete?.user?.email }}</strong>
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
import type { User } from '../../../types/users'
import Drawer from '../Drawer.vue'

const props = withDefaults(
  defineProps<{
    unitId: number
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
const searchResults = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const role = ref<EnrollmentRole>('resident')
const creating = ref(false)
const createError = ref('')

function openDrawer() {
  searchQuery.value = ''
  searching.value = false
  searched.value = false
  searchError.value = ''
  searchResults.value = []
  selectedUser.value = null
  role.value = 'resident'
  creating.value = false
  createError.value = ''
  showDrawer.value = true
}

async function handleSearch() {
  searching.value = true
  searchError.value = ''

  try {
    const response = await api.get<PaginatedResponse<User>>('/admin/users', {
      params: { q: searchQuery.value || undefined, limit: 10 },
    })
    searchResults.value = Array.isArray(response.data.data) ? response.data.data : []
  } catch (err) {
    searchResults.value = []
    searchError.value = extractErrorMessage(err, 'Error inesperado al buscar usuarios.')
  } finally {
    searching.value = false
    searched.value = true
  }
}

function selectUser(user: User) {
  selectedUser.value = user
}

async function handleCreate() {
  if (!selectedUser.value) {
    return
  }

  creating.value = true
  createError.value = ''

  try {
    const response = await api.post<Enrollment>('/admin/enrollments', {
      userId: selectedUser.value.id,
      unitId: props.unitId,
      role: role.value,
    })
    localEnrollments.value = [
      ...localEnrollments.value,
      { ...response.data, user: selectedUser.value },
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
