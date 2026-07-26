<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div>
        <DuiButton variant="ghost" color="neutral" size="sm" to="/admin/units">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Volver
        </DuiButton>
        <h1 class="mt-2 text-2xl">Detalle de unidad</h1>
      </div>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline">
      {{ error }}
    </DuiAlert>

    <p v-if="loading" class="text-gray-500">Cargando...</p>

    <DuiCard v-else-if="unit" title="Informacion de la unidad">
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs uppercase text-gray-500">Nombre</dt>
          <dd class="text-slate-900">{{ unit.name }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Torre</dt>
          <dd class="text-slate-900">{{ unit.tower }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Apto</dt>
          <dd class="text-slate-900">{{ unit.apto }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Piso</dt>
          <dd class="text-slate-900">{{ unit.floor }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Tipologia</dt>
          <dd class="text-slate-900">{{ unit.typology }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Area construida</dt>
          <dd class="text-slate-900">{{ unit.buildArea ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Area privada</dt>
          <dd class="text-slate-900">{{ unit.privateArea ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Coeficiente</dt>
          <dd class="text-slate-900">{{ unit.coefficient ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-gray-500">Estado</dt>
          <dd class="text-slate-900">{{ unit.status }}</dd>
        </div>
      </dl>
    </DuiCard>

    <div v-if="unit" class="mt-6">
      <UnitEnrollments :unit-id="unit.id" :enrollments="unit.enrollments ?? []" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiCard } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import type { ApiErrorResponse } from '../../../types/api'
import type { Unit } from '../../../types/units'
import UnitEnrollments from '../../../components/admin/units/Enrollments.vue'

const route = useRoute()
const unitId = route.params.id as string

const unit = ref<Unit | null>(null)
const loading = ref(false)
const error = ref('')

async function fetchUnit() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<Unit>(`/admin/units/${unitId}`)
    unit.value = response.data
  } catch (err) {
    unit.value = null
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al cargar la unidad.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchUnit)
</script>
