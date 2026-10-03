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
      <div class="py-3">
      <!-- Step 1 -->
       <template v-if="newVistorStape === 1">
        <DuiLabel title="Unidad" required>
          <div  class="flex">
            <DuiInput v-model="unitQ" placeholder="62101" @keyup="fetchUnits" />
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
          size="lg"
          @click="fetchAuthorizations(unit.id)"
          >
          <i class="mdi mdi-office-building-plus-outline"></i>
          Torre: {{ unit.tower }} | {{ unit.apto }}
        </DuiButton>
      </template>
      <template v-if="newVistorStape === 2">
        <DuiButton
          v-for="authorization of authorizations"
          :key="authorization.id"
          block
          variant="outline"
          color="secondary"
          rounded="none"
          size="lg"
          @click="setAuthorization(authorization)"
          >
          <i class="mdi mdi-account-clock"></i> {{ authorization.fullName }} | {{ authorization.document }} 
          <span v-if="authorization.plate">
            <br />
            <i class="mdi mdi-car-clock"></i> {{ authorization.plate }}
          </span>
        </DuiButton>
        <DuiButton
          block
          variant="outline"
          color="secondary"
          rounded="none"
          size="lg"
          @click="newVistorStape = 3"
          >
          <i class="mdi mdi-plus"></i>
          Nuevo visitante
        </DuiButton>
      </template>
      <form v-if="newVistorStape === 3" class="space-y-4" @submit.prevent="storeVisitor">
        

        <DuiLabel title="Nombre completo" required>
          <DuiInput v-model="newVisitor.fullName" placeholder="Juan Pérez" />
        </DuiLabel>

        <DuiLabel title="Documento">
          <DuiInput v-model="newVisitor.document" placeholder="12345678" />
        </DuiLabel>


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

        <div class="flex justify-between gap-2">
          <DuiButton type="submit" color="primary" :loading="loading">
            <i class="mdi mdi-content-save-plus-outline"></i>
            Guardar
          </DuiButton>
          <DuiButton type="button" color="warning" variant="outline" :loading="loading" @click="cancelCreateForm">
            Cancelar
          </DuiButton>
        </div>
      </form>
      </div>
    </DuiDrawer>
    <!-- Search -->
    <div class="flex justify-between items-center mb-3">
      <DuiLabel class="w-full" title="Buscar visitante" help-text="Filtra por nombre, documento o placa de vehículo.">
        <DuiInput v-model="filters.q" placeholder="Nombre, documento o placa"/>
      </DuiLabel>
      <div class="pt-7 px-2">
        <DuiCheckbox v-model="filters.checkout" label="Incluir salidas" />
      </div>
      <div class="pt-7">
        <DuiButton @click="fetchVisitors(1)">
          <i class="mdi mdi-magnify" />
          Buscar
        </DuiButton>
      </div>
    </div>
    <DuiTable
      :columns="[
        { label: 'Visitante', name: 'visitor' },
        { label: 'Vehiculo', name: 'vehicle' },
        { label: 'Tiempo', name: 'time' },
        { label: 'Acciones', name: 'actions' },
      ]"
      :rows="visitors.data"
      :loading="loading"
    >
      <template #visitor="{ fullName, document, unit, authorization }">
        <strong>T{{ unit.tower }} Apto {{ unit.apto }}</strong><br>
        {{ fullName }}<br>
        <small>{{ document }}</small><br>
        <DuiBadge v-if="authorization?.user" color="success">
          Autoriza: {{ authorization?.user?.fullName }}
        </DuiBadge>
      </template>
      <template #vehicle="{ plate, vehicleType }">
        <strong>{{ plate }}</strong><br>
        <small>{{ vehicleTypeLabel(vehicleType) }}</small>
      </template>
      <template #time="{ checkinDate, checkoutDate, createdAt }">
        Ingreso: {{ formatDate(checkinDate) }}<br>
        Salida: {{ formatDate(checkoutDate) }}<br>
        <small>Registrado: {{ formatDate(createdAt) }}</small>
      </template>
      <template #actions="row">
        <div v-if="row.checkinDate && row.vehicleType">
          <DuiBadge size="lg" rounded="none" variant="outline">
            <i class="mdi mdi-clock-time-eight-outline"></i>
            {{ vistorParkingCalc(row.checkinDate, row.checkoutDate, row.vehicleType).hours }} horas
          </DuiBadge>
          <DuiBadge size="lg" rounded="none" variant="outline">
            <i class="mdi mdi-currency-usd"></i>
            {{ vistorParkingCalc(row.checkinDate, row.checkoutDate, row.vehicleType).price }}
          </DuiBadge>
        </div>
        <DuiButton
          v-if="!row.checkinDate"
          size="sm"
          color="primary"
          variant="outline"
          @click="checkinVisitor(row)"
        >
          <i class="mdi mdi-login-variant"></i>
          Registrar ingreso
        </DuiButton>
        <div v-else-if="!row.checkoutDate">
          <DuiButton
            size="sm"
            color="warning"
            variant="outline"
            @click="checkoutVisitor(row)"
          >
            <i class="mdi mdi-logout-variant"></i>
            Registrar salida
          </DuiButton>
        </div>
        
      </template>
    </DuiTable>
    <DuiPagination
      color="primary"
      v-model="filters.currentPage"
      :perPage="filters.perPage"
      :total="filters.total"
      />

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AxiosError } from 'axios'
import {
  DuiBadge,
  DuiButton,
  DuiCheckbox,
  DuiDrawer,
  DuiInput,
  DuiLabel,
  DuiPagination,
  DuiSelect,
  DuiTable,
  useToast
} from '@dronico/droni-kit'
import { api } from '@/services/api'
import UiTitlePage from '@/components/Ui/TitlePage.vue'
import type { ApiErrorResponse, PaginatedResponse } from '@/types/api'
import type { Unit } from '@/types/units'
import type { Visitor, VisitorForm } from '@/types/security/visitors'
import type { Authorization } from '@/types/user/authorization'
import { formatDate, vistorParkingCalc } from '@/services/utils'
import { vehicleTypeLabel } from '@/utils/vehicles'

const toast = useToast()
const loading = ref(false)
const showCreateForm = ref(false)
const filters = ref({
  currentPage: 1,
  perPage: 20,
  total: 0,
  q: '',
  checkout: false
})

const visitors = ref<PaginatedResponse<Visitor>>({
  meta: {
    currentPage: 1,
    perPage: 20,
    total: 0,
  },
  data: []
})
const units = ref<PaginatedResponse<Unit>>({
  data: []
})
const unitQ = ref('')
const authorizations = ref<Authorization[]>([])


const vehicleTypeOptions = [
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Moto' },
]
const newVistorStape = ref(1)
const newVisitor = ref<VisitorForm>({
  unitId: null,
  authorizationId: null,
  fullName: '',
  document: '',
  plate: '',
  vehicleType: null,
  checkinDate: null,
  checkoutDate: null,
})

async function fetchVisitors(page = filters.value.currentPage) {
  loading.value = true
  await api.get<PaginatedResponse<Visitor>>('/security/visitors', {
    params: {
      page,
      limit: filters.value.perPage,
      q: filters.value.q,
      checkout: filters.value.checkout
    },
  }).then(res => {
    visitors.value = res.data
    filters.value.currentPage = res.data.meta?.currentPage ?? page
    filters.value.perPage = res.data.meta?.perPage ?? 20
    filters.value.total = res.data.meta?.total ?? 0
  }).catch(_e=> {
    toast.error('No se pudo obtener la lista de visitantes.')
  }).finally(() => {
    loading.value = false
  })
}

async function fetchUnits() {
  const response = await api.get<PaginatedResponse<Unit>>(`/security/units?q=${unitQ.value}`)
  units.value = response.data
}

async function fetchAuthorizations(unitId:number) {
  const response = await api.get<Unit>(`/security/units/${unitId}`)
  authorizations.value = response.data.authorizations ?? []
  newVisitor.value.unitId = unitId
  newVistorStape.value = 2
}

async function setAuthorization(authorization: Authorization) {
  newVisitor.value.authorizationId = authorization.id
  newVisitor.value.fullName = authorization.fullName
  newVisitor.value.document = authorization.document
  newVisitor.value.plate = authorization.plate
  newVistorStape.value = 3
}

function cancelCreateForm() {
  unitQ.value = ''
  units.value = { data: [] }
  authorizations.value = []
  showCreateForm.value = false
  newVistorStape.value = 1
  newVisitor.value = {
    unitId: null,
    authorizationId: null,
    fullName: '',
    document: '',
    plate: '',
    vehicleType: null,
    checkinDate: null,
    checkoutDate: null,
  }
}

async function storeVisitor() {
  if (loading.value) return
  loading.value = true
  const payload = {
    ...newVisitor.value,
    document: newVisitor.value.document || null,
    plate: newVisitor.value.plate || null,
    authorizationId: newVisitor.value.authorizationId ?? null,
    vehicleType: newVisitor.value.vehicleType ?? null,
    checkinDate: newVisitor.value.checkinDate || null,
    checkoutDate: newVisitor.value.checkoutDate || null,
  }

  await api.post('/security/visitors', payload).then(() => {
    toast.success('Ingreso de visitante guardado correctamente.')
    cancelCreateForm()
    fetchVisitors(1)
  }).catch((err: AxiosError<ApiErrorResponse>) => {
    const body = err.response?.data
    const message =
      body?.errors?.[0]?.message ??
      body?.message ??
      'No se pudo guardar el ingreso del visitante.'
    toast.error(message)
  }).finally(() => {
    loading.value = false
  })
}

function checkinVisitor(visitor: Visitor) {
  if (loading.value) return
  loading.value = true
  api.post(`/security/visitors/${visitor.id}/checkin`).then(() => {
    toast.success('Ingreso de visitante registrado correctamente.')
    fetchVisitors(filters.value.currentPage)
  }).catch((err: AxiosError<ApiErrorResponse>) => {
    const body = err.response?.data
    const message =
      body?.errors?.[0]?.message ??
      body?.message ??
      'No se pudo registrar el ingreso del visitante.'
    toast.error(message)
  }).finally(() => {
    loading.value = false
  })
}

function checkoutVisitor(visitor: Visitor) {
  if (loading.value) return
  loading.value = true
  api.post(`/security/visitors/${visitor.id}/checkout`).then(() => {
    toast.success('Salida de visitante registrada correctamente.')
    fetchVisitors(filters.value.currentPage)
  }).catch((err: AxiosError<ApiErrorResponse>) => {
    const body = err.response?.data
    const message =
      body?.errors?.[0]?.message ??
      body?.message ??
      'No se pudo registrar la salida del visitante.'
    toast.error(message)
  }).finally(() => {
    loading.value = false
  })
}


onMounted(async () => {
  fetchVisitors()
})
</script>