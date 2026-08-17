<template>
  <div v-if="document" class="container mx-auto">
    <h1 class="text-2xl">{{ document.name }}</h1>
    <hr>
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
import { ref, onMounted } from 'vue'
import type { Document } from '../../../types/document' 
import { useRoute } from 'vue-router'
import { DuiCard, DuiBadge } from '@dronico/droni-kit'
import { formatDate } from '../../../utils/helpers'
import AttachmentOpen from '../../../components/AttachmentOpen.vue'

const route = useRoute()

const document = ref<Document | null>(null)

onMounted(async () => {
  const response = await api.get(`/board/documents/${route.params.id}`)
  document.value = response.data
})

</script>