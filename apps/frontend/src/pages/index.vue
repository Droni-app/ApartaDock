
<template>
  <div v-if="user" class="space-y-6">
    <WelcomeBanner :user="user" />
    <div class="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-3">
      <DuiCard class="relative overflow-hidden lg:col-span-2 bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${imgHero})` }">
        <div aria-hidden="true" class="absolute inset-0 bg-linear-to-r from-white/90 via-white/50 to-transparent dark:from-slate-950/85 dark:via-slate-950/40"></div>
        <div class="relative flex min-h-40 flex-col justify-end p-6 sm:min-h-56">
          <p class="text-sm font-medium text-primary-700 dark:text-primary-300">
            Bienvenido a ApartaDock
          </p>
          <h1 class="mt-1 text-3xl text-slate-900 dark:text-white sm:text-4xl">
            Fontibón Reservado
          </h1>
        </div>
      </DuiCard>

      <DuiCard>
        <div class="mb-3 flex items-center justify-between gap-2">
          <h2 class="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <i class="mdi mdi-bullhorn-outline text-primary-600 dark:text-primary-400"></i>
            Comunicaciones recientes
          </h2>
          <RouterLink to="/communications/documents" class="text-sm font-medium text-primary dark:text-primary-400 hover:underline">
            Ver todas
          </RouterLink>
        </div>
        <div v-if="loading" class="space-y-2">
          <DuiSkeleton v-for="n in 3" :key="n" variant="rounded" width="100%" :height="56" />
        </div>
        <p v-else-if="documents.length === 0" class="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <span class="block text-3xl"><i class="mdi mdi-inbox-outline"></i></span>
          No hay comunicaciones publicadas por ahora.
        </p>
        <ul v-else class="space-y-2">
          <li v-for="document in documents" :key="document.id">
            <RouterLink
              :to="`/communications/documents/${document.id}`"
              class="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/5">
              <span class="text-lg leading-6 text-slate-400 group-hover:text-primary-500"><i class="mdi mdi-file-document-outline"></i></span>
              <span>
                <span class="block font-medium text-slate-900 dark:text-slate-100 group-hover:underline">{{ document.name }}</span>
                <span class="block text-sm text-slate-500 dark:text-slate-400">{{ document.category }} | {{ formatDate(String(document.createdAt)) }}</span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </DuiCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DuiCard, DuiSkeleton } from '@dronico/droni-kit'
import { formatDate } from '../utils/helpers'
import { ref } from 'vue'
import { useToast } from '@dronico/droni-kit'
import type { Ref } from 'vue'
import type { PaginatedResponse } from '../types/api'
import type { Document } from '../types/document'
import { api } from '../services/api'
import WelcomeBanner from '../components/dashboard/WelcomeBanner.vue'
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