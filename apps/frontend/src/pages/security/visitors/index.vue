<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Control de visitantes"
      description="Registra ingresos y salidas de visitantes por unidad."
    >
      <DuiButton @click="showCreateForm = true" color="primary">
        <i class="mdi mdi-plus"></i>
        Nuevo ingreso
      </DuiButton>
    </UiTitlePage>

    <DuiDrawer v-model="showCreateForm" name="Ingreso de visitante">
      <!-- Step 1 -->
       <template v-if="!newVisitor.unitId">
        <DuiLabel title="Unidad" required>
          <div  class="flex">
            <DuiInput v-model="q" placeholder="62101" @keyup="fetchUnits" />
            <DuiButton @click="fetchUnits">
              <i class="mdi mdi-magnify" />
            </DuiButton>
          </div>
        </DuiLabel>
        <DuiButton
          v-for="unit of units.data"
          :key="unit.id"
          block
          variant="outline"
          color="secondary"
          rounded="none"
          @click="fetchAuthorizations(unit.id)"
          >
          Torre: {{ unit.tower }} | {{ unit.apto }}
        </DuiButton>
      </template>
      <form  v-else class="space-y-4" @submit.prevent="storeVisitor">
        <DuiLabel title="Nombre completo" required>
          <DuiInput v-model="newVisitor.fullName" placeholder="Juan Pérez" />
        </DuiLabel>

        <DuiLabel title="Documento">
          <DuiInput v-model="newVisitor.document" placeholder="12345678" />
        </DuiLabel>

        <DuiRadio color="primary" :disabled="false" v-model="newVisitor.authorizationId" :options="authorizations" orientation="vertical" size="md" />


        <div class="grid grid-cols-2 gap-3">
          <DuiLabel title="Placa">
            <DuiInput v-model="newVisitor.plate" placeholder="ABC123" />
          </DuiLabel>

          <DuiLabel title="Tipo de vehículo">
            <DuiSelect
              v-model="newVisitor.vehicleType"
              :options="vehicleTypeOptions"
              placeholder="Selecciona"
            />
          </DuiLabel>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <DuiLabel title="Ingreso">
            <DuiInput type="datetime-local" v-model="newVisitor.checkinDate" />
          </DuiLabel>

          <DuiLabel title="Salida">
            <DuiInput type="datetime-local" v-model="newVisitor.chockoutDate" />
          </DuiLabel>
        </div>

        <DuiButton type="submit" color="primary" :loading="loading">
          <i class="mdi mdi-content-save-plus-outline"></i>
          Guardar
        </DuiButton>
      </form>
    </DuiDrawer>

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
      <template #fullName="row">
        <span class="font-medium">{{ row.fullName }}</span>
      </template>

      <template #unit="row">
        {{ row.unit?.name ?? '-' }}
      </template>

      <template #vehicle="row">
        <div>
          <div>{{ row.plate ?? '-' }}</div>
          <small class="text-gray-500">{{ row.vehicleType ?? 'Sin vehículo' }}</small>
        </div>
      </template>

      <template #dates="row">
        <div class="text-sm">
          <div>Ingreso: {{ row.checkinDate || '-' }}</div>
          <div>Salida: {{ row.chockoutDate || '-' }}</div>
        </div>
      </template>

      <template #actions="row">
        <DuiButton size="sm" variant="outline" color="danger" @click="deleteVisitor(row.id)">
          Eliminar
        </DuiButton>
      </template>
    </DuiTable>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { AxiosError } from 'axios'
import { DuiAlert, DuiButton, DuiDrawer, DuiInput, DuiLabel, DuiSelect, DuiTable, DuiRadio, useToast } from '@dronico/droni-kit'
import { api } from '@/services/api'
import UiTitlePage from '@/components/Ui/TitlePage.vue'
import type { ApiErrorResponse, PaginatedResponse } from '@/types/api'
import type { Unit } from '@/types/units'
import type { Visitor, VisitorForm } from '@/types/security/visitors'
import type { Authorization } from '@/types/user/authorization'

const toast = useToast()
const loading = ref(false)
const error = ref('')
const showCreateForm = ref(false)
const currentPage = ref(1)
const perPage = ref(20)
const total = ref(0)
const visitors = ref<Visitor[]>([])
const units = ref<PaginatedResponse<Unit>>({
  data: []
})
const authorizations = ref<Authorization[]>([])
const q = ref('')

const vehicleTypeOptions = [
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Moto' },
]

const newVisitor = ref<VisitorForm>({
  unitId: null,
  authorizationId: null,
  fullName: '',
  document: '',
  plate: '',
  vehicleType: null,
  checkinDate: null,
  chockoutDate: null,
})

const columns = [
  { name: 'fullName', label: 'Visitante' },
  { name: 'unit', label: 'Unidad' },
  { name: 'vehicle', label: 'Vehículo' },
  { name: 'dates', label: 'Fechas' },
  { name: 'actions', label: '' },
]

const tablePagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage.value,
  total: total.value || visitors.value.length,
}))

const tableRows = computed(() =>
  visitors.value.map((visitor) => ({
    ...visitor,
    checkinDate: formatDate(visitor.checkinDate),
    chockoutDate: formatDate(visitor.chockoutDate),
    vehicleType: visitor.vehicleType ? (visitor.vehicleType === 'car' ? 'Carro' : 'Moto') : 'Sin vehículo',
  }))
)

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

async function fetchVisitors(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<PaginatedResponse<Visitor>>('/security/visitors', {
      params: {
        page,
        limit: perPage.value,
      },
    })

    const payload = response.data
    visitors.value = Array.isArray(payload.data) ? payload.data : []
    currentPage.value = payload.meta?.currentPage ?? page
    perPage.value = payload.meta?.perPage ?? perPage.value
    total.value = payload.meta?.total ?? visitors.value.length
  } catch (err) {
    visitors.value = []
    total.value = 0
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      (err instanceof Error ? err.message : 'Error inesperado al cargar visitantes.')
  } finally {
    loading.value = false
  }
}

async function fetchUnits() {
  const response = await api.get<PaginatedResponse<Unit>>(`/security/units?q=${q.value}`)
  units.value = response.data
}

async function fetchAuthorizations(unitId:number) {
  const response = await api.get<Unit>(`/security/units/${unitId}`)
  authorizations.value = response.data.authorizations ?? []
  newVisitor.value.unitId = unitId
}

async function storeVisitor() {
  if (loading.value) return

  loading.value = true
  error.value = ''

  try {
    const payload = {
      ...newVisitor.value,
      document: newVisitor.value.document || null,
      plate: newVisitor.value.plate || null,
      authorizationId: newVisitor.value.authorizationId ?? null,
      vehicleType: newVisitor.value.vehicleType ?? null,
      checkinDate: newVisitor.value.checkinDate || null,
      chockoutDate: newVisitor.value.chockoutDate || null,
    }

    await api.post('/security/visitors', payload)
    toast.success('Ingreso de visitante guardado correctamente.')
    showCreateForm.value = false
    newVisitor.value = {
      unitId: null,
      authorizationId: null,
      fullName: '',
      document: '',
      plate: '',
      vehicleType: null,
      checkinDate: null,
      chockoutDate: null,
    }
    await fetchVisitors(1)
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      'No se pudo guardar el ingreso del visitante.'
  } finally {
    loading.value = false
  }
}

async function deleteVisitor(id: number) {
  loading.value = true

  try {
    await api.delete(`/security/visitors/${id}`)
    toast.success('Registro eliminado correctamente.')
    await fetchVisitors(currentPage.value)
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorResponse>
    const body = axiosError.response?.data
    error.value =
      body?.errors?.[0]?.message ??
      body?.message ??
      'No se pudo eliminar el registro.'
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  fetchVisitors(page)
}

onMounted(async () => {
  await Promise.all([fetchAuthorizations(), fetchVisitors()])
})
</script>