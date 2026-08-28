<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Autorizaciones"
      description="Autoriza la entrada de personas y uso de parqueaderos de visitantes."
    >
      <DuiButton @click="showCreateFrom = true">
        <i class="mdi mdi-plus" />
        Nuevo autorizado
      </DuiButton>
    </UiTitlePage>
    <DuiDrawer v-model="showCreateFrom" name="Agregar nuevo autorizado">
      <p class="mb-4">
        Las personas autorizadas podrán acceder por la entrada peatonal como hacer uso del parqueadero de visitantes siempre que el numero de placa este registrado.
      </p>
      <form @submit.prevent="storeAuthorization">
        <DuiLabel class="block mb-3" title="Unidad" help-text="Unidad a la que se autoriza el ingreso del visitante." required>
          <DuiSelect v-model="newAuthorization.unitId" :options="enrollments" item-value="unitId" item-label="unit.name" placeholder="Selecciona..." required />
        </DuiLabel>
        <DuiLabel class="block mb-3" title="Nombre completo" help-text="Nombre completo de la persona que se autoriza para el ingreso. ej Pedro Perez" required>
          <DuiInput v-model="newAuthorization.fullName" placeholder="Pedro Perez" required />
        </DuiLabel>
        <DuiLabel class="block mb-3" title="Número de documento" help-text="Número de documento con el que se identificará la persona." required>
          <DuiInput v-model="newAuthorization.document" placeholder="00000000" required />
        </DuiLabel>
        <DuiLabel class="block mb-3" title="Placa de vehículo" help-text="Número de placa del vehiculo para ingresar a parqueadero de visitantes.">
          <DuiInput v-model="newAuthorization.plate" placeholder="ABC123" />
        </DuiLabel>
        <DuiLabel class="block mb-3" title="Fecha máxima de autorización" help-text="Sí desea autorizar al visitante solo hasta una fecha específica puede definirla en este campo.">
          <DuiInput type="date" v-model="newAuthorization.authorizedDate" placeholder="ABC123" />
        </DuiLabel>
        <p class="text-sm mb-3">
          Al agregar una persona autorizada, acepta la responsabilidad respecto a la copropiedad y el cargo por concepto de cobro de parqueadero de visitantes (cuando aplique).
        </p>
        <DuiButton :loading type="submit" variant="solid" color="primary">
          <i class="mdi mdi-content-save-plus-outline" />
          Guardar
        </DuiButton>
      </form>
    </DuiDrawer>
    <UiAuthorizationsCard
      v-for="authorization of authorizations.data"
      :key="authorization.id"
      :authorization="authorization" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UiTitlePage from '../../../components/Ui/TitlePage.vue'
import { DuiButton, DuiDrawer, DuiLabel, DuiInput, DuiSelect, useToast } from '@dronico/droni-kit';
import { api } from '../../../services/api'
import type { AxiosError } from 'axios';
import type { PaginatedResponse, ValidationErrors } from '../../../types/api.ts';
import type { Enrollment } from '../../../types/enrollments.ts';
import type { Authorization, AuthorizationNew } from '../../../types/user/authorization';
import UiAuthorizationsCard from '@components/management/Authorizations/Card.vue'

const toast = useToast()

const loading = ref(false)
const showCreateFrom = ref(false)
const authorizations = ref<PaginatedResponse<Authorization>>({
  data: []
})
const enrollments = ref<Enrollment[]>([])
const newAuthorization =ref<AuthorizationNew>({
  unitId: 0,
  fullName: '',
  document: '',
  plate: null,
  authorizedDate: null
})

function getAuthorizations() {
  api.get<PaginatedResponse<Authorization>>('/user/authorizations').then(res=>{
    authorizations.value = res.data
  })
}

function getEnrollments() {
  api.get<Enrollment[]>('/user/enrollments').then(res=>{
    enrollments.value = res.data
  })
}

function storeAuthorization() {
  if (loading.value) return;
  loading.value = true
  api.post('/user/authorizations', newAuthorization.value).then(() => {
    toast.success('Nuevo autorizado guardado correctamente.')
    getAuthorizations()
    newAuthorization.value = {
      unitId: null,
      fullName: '',
      document: '',
      plate: null,
      authorizedDate: null
    }
    showCreateFrom.value = false
  }).catch((e:AxiosError<ValidationErrors>) => {
    toast.error(
      e.response?.data?.errors ? 
        e.response?.data.errors[0]?.message :
        'Se produjo un error al gaurdar la autorización.'
    )
  }).finally(() => {
    loading.value = false
  })

}

onMounted(() => {
  getAuthorizations()
  getEnrollments()
})
</script>