<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Mis unidades"
      description="Unidades donde figuras como propietario, arrendatario o residente."
    >
      <DuiButton @click="showCreateFrom = true">
        <i class="mdi mdi-plus" />
        Nuevo PQR
      </DuiButton>
    </UiTitlePage>
    <DuiDrawer v-model="showCreateFrom">
      <form @submit.prevent="storeTicket">
        <p class="mb-4">
          Realiza tus peticiones, quejas y reclamos a travez de esta herramienta para recibir una respuesta y atención oportuna a todos tus requerimientos.
        </p>
        <DuiLabel class="block mb-3" title="Unidad" help-text="Unidad a la que está asociado el PQR." required>
          <DuiSelect v-model="newTicket.unitId" :options="enrollments" item-value="unitId" item-label="unit.name" placeholder="Selecciona..." required />
        </DuiLabel>
        <DuiLabel class="block mb-3" title="Asunto" help-text="Título descriptivo de tu PQR." required>
          <DuiInput v-model="newTicket.name" placeholder="Pregunta, queja o reclamo" required />
        </DuiLabel>
        <p class="mb-2">
          ¿A quienes quieres dirigir tu PQR?
        </p>
        <DuiCheckbox class="mb-3" v-model="newTicket.owners" value="board">
          Consejo de administración
        </DuiCheckbox><br>
        <DuiCheckbox class="mb-3" v-model="newTicket.owners" value="admin">
          Administración
        </DuiCheckbox><br>
        <DuiCheckbox class="mb-3" v-model="newTicket.owners" value="security">
          Seguridad
        </DuiCheckbox>
        <p class="mb-2">
          Detalla tu colicitud.
        </p>
        <WysiwygEditor class="block mb-3" v-model="newTicket.content" />
        <DuiLabel class="block mb-3" title="Adjuntos (opcional)" help-text="Enlace al documento (PDF o imagen).">
          <AttachmentUrlInput v-model="newTicket.attachment" accept="image/*,application/pdf" />
        </DuiLabel>
        <DuiButton :loading type="submit" variant="solid" color="primary">
          <i class="mdi mdi-content-save-plus-outline" />
          Guardar
        </DuiButton>
      </form>
    </DuiDrawer>
    <UserTicketsCard v-for="ticket in tickets.data" :key="ticket.id" :ticket="ticket" />
    <DuiPagination
      v-model="filters.page"
      :perPage="filters.perPage"
      :total="tickets.meta?.total ?? 0"
      @change="getTickets"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UiTitlePage from '../../../components/Ui/TitlePage.vue'
import { DuiLabel, DuiSelect, DuiButton, DuiInput, DuiDrawer, useToast, DuiCheckbox, DuiPagination } from '@dronico/droni-kit'
import WysiwygEditor from '../../../components/WysiwygEditor.vue'
import AttachmentUrlInput from '../../../components/AttachmentUrlInput.vue'
import UserTicketsCard from '@/components/user/Tickets/Card.vue' 
import { api } from '../../../services/api.ts'
import type { Enrollment } from '@/types/enrollments.ts';
import type { Ticket, NewTicket } from '@/types/user/tickets.js'
import type { PaginatedResponse } from '@/types/api.ts'
const toast = useToast()
const filters = ref({
  q: '',
  page: 1,
  perPage: 20
})
const tickets = ref<PaginatedResponse<Ticket>>({ data: [], meta: {} })
const enrollments = ref<Enrollment[]>([])
const showCreateFrom = ref(false)
const loading = ref(false)
const newTicket = ref<NewTicket>({
  unitId: 0,
  name: '',
  content: '',
  attachment: '',
  owners: ['board', 'admin']
})

async function getTickets() {
  loading.value = true
  await api.get<PaginatedResponse<Ticket>>('/user/tickets', { params: filters.value }).then(res=>{
    tickets.value = res.data
  }).catch(e=>{
    console.log(e)
    toast.error('Error al traer los tickets.')
  }).finally(()=>{ loading.value = false })
  
}
function getEnrollments() {
  api.get<Enrollment[]>('/user/enrollments').then(res=>{
    enrollments.value = res.data
  })
}
async function storeTicket() {
  loading.value = true
  api.post<Ticket>('/user/tickets', newTicket.value).then(res=>{
    showCreateFrom.value = false
    newTicket.value = {
      unitId: 0,
      name: '',
      content: '',
      attachment: '',
      owners: ['board', 'admin']
    }
    toast.success(`Ticket (${res.data.name}) creado, pronto será revisado.`)
  }).catch(e=>{
    console.log(e)
    toast.error('Error al guardar el ticket.')
  }).finally(()=>{ loading.value = false })
}

onMounted(()=>{
  getTickets()
  getEnrollments()
})
</script>