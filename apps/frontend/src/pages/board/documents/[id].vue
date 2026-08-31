<template>
  <div>
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
        <Form v-model="document" />
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
          <div v-if="document.picture">
            <strong class="block">
              Imagen
            </strong>
            <AttachmentOpen :attachment="document.picture" />
          </div>
        </div>
      </DuiCard>
      
      <DuiCard>
        <div class="lg:grid lg:grid-cols-2 gap-4">
          <div v-if="document.picture" class="mb-4 lg:mb-0">
            <img
            :src="document.picture"
            :alt="document.name"
            class="w-full h-auto mb-4 rounded-md shadow p-4" />
          </div>
          <article class="prose dark:prose-invert lg:prose-xl" v-html="document.content"></article>
        </div>
      </DuiCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { api } from '../../../services/api'
import { ref, onMounted } from 'vue'
import type { Document } from '../../../types/document' 
import { useRoute, useRouter } from 'vue-router'
import { DuiCard, DuiBadge, DuiButton, DuiDrawer, DuiConfirmation, useToast } from '@dronico/droni-kit'
import { formatDate } from '../../../utils/helpers'
import AttachmentOpen from '../../../components/AttachmentOpen.vue'
import UiPageTitle from '../../../components/Ui/TitlePage.vue'
import Form from '../../../components/board/documents/Form.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const document = ref<Document | null>(null)
const editModal = ref(false)

onMounted(async () => {
  api.get(`/board/documents/${route.params.id}`)
    .then((response) => {
      document.value = response.data
    }).catch(_error => {
      toast.add({
        color: 'danger',
        message: 'Error al cargar el documento.'
      })
    })
  
})

function updateDocument() {
  api.put(`/board/documents/${document.value!.id}`, document.value)
    .then(_response => {
      console.log(document.value)
      editModal.value = false
      toast.add({
        color: 'success',
        message: 'Documento guardado correctamente.'
      })
    })
    .catch(_error => {
      toast.add({
        color: 'danger',
        message: 'Error al guardar el documento.'
      })
    })
}

function deleteDocument() {
  api.delete(`/board/documents/${document.value!.id}`)
    .then(_res => {
      toast.add({
        color: 'success',
        message: 'Documento eliminado correctamente.'
      })
      router.push('/board/documents')
    })
    .catch(_error => {
      toast.add({
        color: 'danger',
        message: 'Error al eliminar el documento.'
      })
    })
}

</script>