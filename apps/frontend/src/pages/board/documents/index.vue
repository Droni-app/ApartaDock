<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl">Documents</h1>
      <DuiButton @click="createModal = true" color="primary">Create Document</DuiButton>
      <DuiDrawer v-model="createModal">
        <!-- Create Document Form goes here -->
        <Form v-model="newDocument" :request-error="requestError"/>
        <DuiButton color="primary" @click="storeDocument">Guardar</DuiButton>
      </DuiDrawer>
    </div>
    <DuiAlert v-if="requestError" color="danger" class="mb-4">
      {{ requestError }}
    </DuiAlert>
    <DuiTable :columns="[
      { label: 'Documento', name: 'name' },
      { label: 'Tipo', name: 'type' },
      { label: 'Creado el', name: 'createdAt' },
      { label: 'Acciones', name: 'actions' }
    ]" :rows="documents"
      :loading="loading">
    </DuiTable>
  </div>
</template>
<script setup lang="ts">
import { DuiAlert, DuiButton, DuiTable, DuiDrawer } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import type { PaginatedResponse } from '../../../types/api'
import type { Document } from '../../../types/document'
import Form from '../../../components/board/documents/Form.vue'

const loading = ref(false)
const requestError: Ref<string | null> = ref(null)
const documents: Ref<Document[]> = ref([])
const createModal = ref(false)

const newDocument: Ref<Document> = ref({
  id: 0,
  userId: 0,
  name: '',
  category: '',
  picture: '',
  document: '',
  content: '',
  active: true,
  createdAt: '',
  updatedAt: ''
})

function fetchDocuments() {
  loading.value = true
  api.get<PaginatedResponse<Document>>('/board/documents')
    .then(response => {
      documents.value = response.data.data
    })
    .catch(error => {
      console.error('Error fetching documents:', error)
      requestError.value = 'Failed to load documents.'
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  fetchDocuments()
})

function storeDocument() {
  console.log('Storing document:', newDocument.value)
  api.post('/board/documents', newDocument.value)
    .then(response => {
      documents.value.push(response.data)
      createModal.value = false
      // Reset newDocument
      newDocument.value = {
        id: 0,
        userId: 0,
        name: '',
        category: '',
        picture: '',
        document: '',
        content: '',
        active: true,
        createdAt: '',
        updatedAt: ''
      }
    })
    .catch(error => {
      console.error('Error creating document:', error)
      requestError.value = 'Failed to create document.'
    })
}
</script>