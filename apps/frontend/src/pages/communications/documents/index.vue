<template>
  <div class="flex flex-col gap-4">
    <UiTitlePage
      title="Documentos"
      description="Lista de documentos disponibles."
    />

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

    <div v-if="loading" class="py-8 text-center text-gray-500 dark:text-slate-400">
      Cargando documentos...
    </div>

    <div v-else-if="!documents.length" class="py-8 text-center text-gray-500 dark:text-slate-400">
      No se encontraron documentos con los filtros aplicados.
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DuiCard v-for="item in documents" :key="item.id" class="h-full">
        <RouterLink :to="`/communications/documents/${item.id}`" class="block">
          <img
            v-if="item.picture"
            :src="item.picture"
            :alt="`Imagen de ${item.name}`"
            class="mb-4 h-44 w-full rounded-lg object-cover"
          />

          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ item.name }}</h3>
              <DuiBadge color="primary">
                {{ item.category ?? 'Sin categoría' }}
              </DuiBadge>
            </div>

            <p class="text-sm text-gray-600 dark:text-slate-300">
              {{ item.user?.fullName ?? 'Autor no disponible' }}
              <span v-if="item.user?.email" class="block text-xs text-gray-500 dark:text-slate-400">{{ item.user.email }}</span>
            </p>

            <div class="text-xs text-gray-500 dark:text-slate-400">
              <p>Creado: {{ renderDate(item.createdAt) }}</p>
              <p>Actualizado: {{ renderDate(item.updatedAt) }}</p>
            </div>

            <AttachmentOpen :attachment="item.document" />
          </div>
        </RouterLink>
      </DuiCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DuiBadge, DuiCard, DuiInput, DuiButton, DuiSelect, useToast } from '@dronico/droni-kit'
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

function renderDate(value: string | null) {
  if (!value) {
    return 'N/D'
  }

  return formatDate(value)
}

onMounted(() => {
  fetchDocuments()
})
</script>