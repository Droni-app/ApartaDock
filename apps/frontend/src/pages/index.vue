
<template>
  <div v-if="user" class="space-y-6">
    <WelcomeBanner :user="user" />
    <div class="mx-auto mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <DuiCard class="lg:col-span-2 bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${imgHero})` }">
        <div class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 p-6">
          <div>
            <p class="text-sm font-medium text-pink-800 text-shadow-2xs text-shadow-white">
              Bienvenido a ApartaDock
            </p>
            <h1 class="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100 text-shadow-2xs text-shadow-white">
              Fontibón Reservado
            </h1>
          </div>
        </div>
      </DuiCard>

      <DuiCard>
        <DuiAlert v-for="document in documents" :key="document.id" color="primary">
          <RouterLink
            :to="`/communications/documents/${document.id}`"
            class="font-medium text-slate-900 dark:text-slate-100 hover:underline">
            {{ document.name }}
          </RouterLink>
          <p class="text-sm text-gray-500 dark:text-slate-400">{{ document.category }} | {{ formatDate(String(document.createdAt)) }}</p>
        </DuiAlert>
      </DuiCard>
    </div>

    <RoleDashboard :role="user.role" />
  </div>
</template>
<script setup lang="ts">
import { DuiCard, DuiAlert } from '@dronico/droni-kit'
import { formatDate } from '../utils/helpers'
import { ref } from 'vue'
import { useToast } from '@dronico/droni-kit'
import type { Ref } from 'vue'
import type { PaginatedResponse } from '../types/api'
import type { Document } from '../types/document'
import { api } from '../services/api'
import WelcomeBanner from '../components/dashboard/WelcomeBanner.vue'
import RoleDashboard from '../components/dashboard/RoleDashboard.vue'
import { useAuth } from '../composables/useAuth'
import imgHero from '../assets/hero.webp'

const { user } = useAuth()
const toast = useToast()

// TODO: reemplazar por novedades reales del conjunto cuando exista el modulo de comunicaciones.


const documents: Ref<Document[]> = ref([])

const loading = ref(false)

function fetchDocuments() {
  loading.value = true
  api.get<PaginatedResponse<Document>>('/user/documents', {
      params: {
        category: 'Comunicaciones',
        perPage: 5
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
//

fetchDocuments()
</script>