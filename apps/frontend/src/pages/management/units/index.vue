<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Mis unidades"
      description="Unidades donde figuras como propietario, arrendatario o residente."
    />

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500 dark:text-slate-400">Cargando...</p>

    <p v-else-if="!enrollments.length" class="text-sm text-gray-500 dark:text-slate-400">
      No tienes unidades asociadas a tu cuenta.
    </p>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DuiCard v-for="enrollment in enrollments" :key="enrollment.id">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i class="mdi mdi-door text-2xl"></i>
            </div>
            <div>
              <p class="text-lg font-semibold text-slate-900 dark:text-slate-100">Unidad {{ enrollment.unit?.name ?? '-' }}</p>
              <p class="text-sm text-gray-500 dark:text-slate-400">
                Torre {{ enrollment.unit?.tower ?? '-' }} - Piso {{ enrollment.unit?.floor ?? '-' }}
              </p>
            </div>
          </div>
          <DuiBadge :color="roleColor(enrollment.role)" variant="soft">{{ roleLabel(enrollment.role) }}</DuiBadge>
        </div>

        <dl class="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt class="text-xs uppercase text-gray-400 dark:text-slate-500">Área privada</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.privateArea ?? '-' }} m²</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-400 dark:text-slate-500">Área construida</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.buildArea ?? '-' }} m²</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-400 dark:text-slate-500">Coeficiente</dt>
            <dd class="text-slate-900 dark:text-slate-100">{{ enrollment.unit?.coefficient ?? '-' }}</dd>
          </div>
        </dl>

        <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <i class="mdi mdi-information-outline"></i>
            Estado: {{ enrollment.unit?.status ?? '-' }}
          </div>
          <DuiButton size="sm" variant="outline" color="primary" :to="`/management/units/${enrollment.id}`">
            Ver detalle
          </DuiButton>
        </div>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import { DuiAlert, DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'
import type { Enrollment } from '../../../types/enrollments'
import UiTitlePage from '../../../components/Ui/TitlePage.vue'

const enrollments = ref<Enrollment[]>([])
const loading = ref(false)
const error = ref('')

const roleOptions: Array<{ value: string; label: string; color: 'primary' | 'secondary' | 'neutral' }> = [
  { value: 'owner', label: 'Propietario', color: 'primary' },
  { value: 'tenant', label: 'Arrendatario', color: 'secondary' },
  { value: 'resident', label: 'Residente', color: 'neutral' },
]

function roleLabel(role: string) {
  return roleOptions.find((option) => option.value === role)?.label ?? role
}

function roleColor(role: string) {
  return roleOptions.find((option) => option.value === role)?.color ?? 'neutral'
}

async function fetchEnrollments() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<Enrollment[]>('/user/enrollments')
    enrollments.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    enrollments.value = []
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al cargar tus unidades.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchEnrollments)
</script>
