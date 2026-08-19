<template>
  <div class="flex flex-col gap-4">
    <UiTitlePage
      title="Documentos"
      description="Lista de documentos disponibles."
    >
    </UiTitlePage>

    <DuiCard>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <DuiInput
          v-model="q"
          class="flex-grow"
          placeholder="Buscar documentos..."
          icon="mdi-magnify"
        />
        <DuiSelect
          v-model="category"
          label="Categoría"
          placeholder="Filtrar por categoría"
          item-label="value"
          :options="[
            { value: 'Reglamentos'},
            { value: 'Comunicaciones'},
            { value: 'Actas'},
            { value: 'Estados financieros'},
            { value: 'Formatos'},
            { value: 'Otros'},
          ]"
        />
        <DuiButton
          color="primary"
          class="flex-grow-2"
          @click="fetchDocuments"
        >
          <i class="mdi mdi-magnify"></i>
          <span class="ml-2">Buscar</span>
        </DuiButton>
      </div>
    </DuiCard>

    <DuiTable :columns="[
      { label: 'Nombre', name: 'name' },
      { label: 'Documento', name: 'document' },
      { label: 'Autor', name: 'author' },
      { label: 'Fechas', name: 'timestamps' }
    ]" :rows="documents"
      :loading="loading">
      <template #name="{ id, name, category }">
        <RouterLink :to="`/communications/documents/${id}`" class="block">
          <strong>{{ name }}</strong>
        </RouterLink>
        <DuiBadge color="primary">
          {{ category ?? 'Sin categoría' }}
        </DuiBadge>
      </template>
      <template #document="{ document }">
        <AttachmentOpen :attachment="document" />
      </template>
      <template #author="{ user }">
        {{ user.fullName }}<br>
        <small>{{ user.email }}</small>
      </template>
      <template #timestamps="{ createdAt, updatedAt }">
        <small>
          Creado: {{ formatDate(createdAt) }}<br>
          Actualizado: {{ formatDate(updatedAt) }}<br>
        </small>
      </template>
    </DuiTable>
  </div>
</template>
<script setup lang="ts">
import { DuiTable, DuiBadge, DuiCard, DuiInput, DuiButton, DuiSelect, useToast } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import { ref, onMounted } from 'vue'

import type { Ref } from 'vue'
import type { PaginatedResponse } from '../../../types/api'
import type { Document } from '../../../types/document'
import AttachmentOpen from '../../../components/AttachmentOpen.vue'
import { RouterLink } from 'vue-router'
import { formatDate } from '../../../utils/helpers'
import UiTitlePage from '../../../components/Ui/TitlePage.vue'

const toast = useToast()
const loading = ref(false)
const documents: Ref<Document[]> = ref([])
const q = ref('')
const category = ref('')

function fetchDocuments() {
  loading.value = true
  api.get<PaginatedResponse<Document>>('/user/documents', {
      params: {
        q: q.value,
        category: category.value
      }
    })
    .then(response => {
      documents.value = response.data.data
    })
    .catch(_error => {
      toast.add({
        color: 'danger',
        title: 'Error',
        message: 'Error al cargar documentos'
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  fetchDocuments()
})
</script>