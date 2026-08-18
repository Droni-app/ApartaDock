<template>
  <div v-if="document" class="container mx-auto">
    <UiPageTitle
      :title="document.name"
      :description="`Creado por ${document.user?.fullName} en ${document.category ?? 'Sin categoría'}`"
    >
      <DuiButton @click="editModal = true" color="primary">
        <i class="mdi mdi-pencil"></i> Editar
      </DuiButton>
    </UiPageTitle>
    <DuiDrawer v-model="editModal">
      <Form v-model="document" :request-error="requestError"/>
      <template #actions>
        <DuiConfirmation
          label="Eliminar"
          check-label="Confirmar eliminación"
          confirm-label="Eliminar"
          @confirmed="deleteDocument"
        />
        <DuiButton color="primary" @click="updateDocument">Guardar</DuiButton>
      </template>
    </DuiDrawer>
    <DuiCard class="my-8" size="s">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <strong class="block">
            <i class="mdi mdi-account-outline"></i> Autor
          </strong>
          <span>
            {{ document.user?.fullName }}<br>
            {{ document.user?.email }}
          </span>
        </div>
        <div>
          <strong class="block">
            <i class="mdi mdi-folder-outline"></i>
            Categoría
          </strong>
          <DuiBadge color="neutral">
            {{ document.category ?? 'Sin categoría' }}
          </DuiBadge>
        </div>
        <div>
          <strong class="block">
            Fechas
          </strong>
          <span>
            Creado: {{ formatDate(String(document.createdAt)) }}<br>
            Actualizado: {{ formatDate(String(document.updatedAt)) }}
          </span>
        </div>
        <div>
          <strong class="block">
            Documento
          </strong>
          <AttachmentOpen :attachment="document.document" />
        </div>
      </div>
    </DuiCard>
    
    <DuiCard>
      <div v-html="document.content"></div>
    </DuiCard>
  </div>
  
</template>
<script setup lang="ts">
import { api } from '../../../services/api'
import { ref, onMounted, type Ref } from 'vue'
import type { Document } from '../../../types/document' 
import { useRoute, useRouter } from 'vue-router'
import { DuiCard, DuiBadge, DuiButton, DuiDrawer, DuiConfirmation } from '@dronico/droni-kit'
import { formatDate } from '../../../utils/helpers'
import AttachmentOpen from '../../../components/AttachmentOpen.vue'
import UiPageTitle from '../../../components/Ui/TitlePage.vue'
import Form from '../../../components/board/documents/Form.vue'

const route = useRoute()
const router = useRouter()

const document = ref<Document | null>(null)
const editModal = ref(false)
const requestError: Ref<string | null> = ref(null)

onMounted(async () => {
  const response = await api.get(`/board/documents/${route.params.id}`)
  document.value = response.data
})

function updateDocument() {
  api.put(`/board/documents/${document.value!.id}`, document.value)
    .then(response => {
      editModal.value = false
      document.value = response.data
    })
    .catch(error => {
      console.error('Error creating document:', error)
      requestError.value = 'Failed to create document.'
    })
}

function deleteDocument() {
  api.delete(`/board/documents/${document.value!.id}`)
    .then(_res => {
      router.push('/board/documents')
    })
    .catch(error => {
      console.error('Error creating document:', error)
      requestError.value = 'Failed to create document.'
    })
}

</script>