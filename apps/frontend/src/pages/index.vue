
<template>
  <div v-if="user" class="space-y-6">
    <WelcomeBanner :user="user" />
    <div class="mx-auto mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <DuiCard class="lg:col-span-2">
        <div class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
          <div>
            <p class="text-sm font-medium text-blue-600">Bienvenido a ApartaDock</p>
            <h1 class="mt-1 text-3xl font-semibold text-slate-900">Fontibón Reservado</h1>
            <p class="mt-3 text-gray-500">
              La plataforma para administrar tu conjunto residencial: cartera, reservas, vehículos, autorizaciones y la
              gestión del consejo y la administración, todo en un solo lugar.
            </p>
          </div>

          <svg viewBox="0 0 400 300" class="w-full" role="img" aria-label="Ilustracion de un conjunto residencial">
            <rect width="400" height="300" rx="16" fill="#eff6ff" />
            <circle cx="330" cy="60" r="28" fill="#fcd34d" />
            <rect x="0" y="240" width="400" height="60" fill="#dbeafe" />
            <rect x="40" y="120" width="140" height="120" rx="6" fill="#cbd5e1" />
            <rect x="60" y="140" width="20" height="20" rx="2" fill="#2563eb" />
            <rect x="100" y="140" width="20" height="20" rx="2" fill="#2563eb" />
            <rect x="140" y="140" width="20" height="20" rx="2" fill="#2563eb" />
            <rect x="60" y="175" width="20" height="20" rx="2" fill="#2563eb" />
            <rect x="100" y="175" width="20" height="20" rx="2" fill="#2563eb" />
            <rect x="140" y="175" width="20" height="20" rx="2" fill="#2563eb" />
            <rect x="95" y="210" width="30" height="30" fill="#1e3a8a" />
            <rect x="190" y="80" width="110" height="160" rx="6" fill="#94a3b8" />
            <rect x="205" y="100" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="238" y="100" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="271" y="100" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="205" y="130" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="238" y="130" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="271" y="130" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="205" y="160" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="238" y="160" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="271" y="160" width="18" height="18" rx="2" fill="#eff6ff" />
            <rect x="236" y="200" width="28" height="40" fill="#1e293b" />
            <circle cx="330" cy="255" r="18" fill="#16a34a" />
            <rect x="326" y="255" width="8" height="30" fill="#78350f" />
          </svg>
        </div>
      </DuiCard>

      <DuiCard>
        <DuiAlert v-for="document in documents" :key="document.id" color="primary">
          <RouterLink
            :to="`/communications/documents/${document.id}`"
            class="font-medium text-slate-900 hover:underline">
            {{ document.name }}
          </RouterLink>
          <p class="text-sm text-gray-500">{{ document.category }} | {{ formatDate(String(document.createdAt)) }}</p>
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

const { user } = useAuth()
const toast = useToast()

// TODO: reemplazar por novedades reales del conjunto cuando exista el modulo de comunicaciones.


const documents: Ref<Document[]> = ref([])

const loading = ref(false)

function fetchDocuments() {
  loading.value = true
  api.get<PaginatedResponse<Document>>('/user/documents', {
      params: {
        category: 'Comunicaciones'
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