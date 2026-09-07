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
       <template v-if="newVistorStape === 1">
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
    </DuiDrawer>

    <DuiDrawer v-model="updateDrawer" name="Ingreso de visitante">

    </DuiDrawer>

    <SecurityVisitorsCard
      v-for="visitor of visitors"
      :key="visitor.id"
      :visitor="visitor"
      @checkin="checkinVisitor"
      @checkout="checkoutVisitor"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AxiosError } from 'axios'
import { DuiButton, DuiDrawer, DuiInput, DuiLabel, DuiSelect, useToast } from '@dronico/droni-kit'
import { api } from '@/services/api'
import UiTitlePage from '@/components/Ui/TitlePage.vue'
import type { ApiErrorResponse, PaginatedResponse } from '@/types/api'
import type { Unit } from '@/types/units'
import type { Visitor, VisitorForm } from '@/types/security/visitors'
import type { Authorization } from '@/types/user/authorization'
import SecurityVisitorsCard from '@/components/security/Visitors/Card.vue'

const toast = useToast()
const loading = ref(false)
const showCreateForm = ref(false)
const updateDrawer = ref(false)
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

async function fetchVisitors(page = currentPage.value) {
  loading.value = true
  await api.get<PaginatedResponse<Visitor>>('/security/visitors', {
    params: {
      page,
      limit: perPage.value,
    },
  }).then(res => {
    visitors.value = res.data.data
    currentPage.value = res.data.meta?.currentPage ?? page
    perPage.value = res.data.meta?.perPage ?? perPage.value
    total.value = res.data.meta?.total ?? visitors.value.length
  }).catch(_e=> {
    toast.error('No se pudo obtener la lista de visitantes.')
  }).finally(() => {
    loading.value = false
  })
}

async function fetchUnits() {
  const response = await api.get<PaginatedResponse<Unit>>(`/security/units?q=${q.value}`)
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
  q.value = ''
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
    fetchVisitors(currentPage.value)
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
    fetchVisitors(currentPage.value)
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