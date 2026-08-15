<template>
  <div class="space-y-6">
    <ParkingRequestsDashboard />

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <DuiSkeleton v-if="loading" variant="rounded" height="84" />
      <StatTile
        v-else
        icon="mdi-file-document-outline"
        label="Actas registradas"
        :value="minutesTotal"
        hint="Historial de reuniones del consejo"
        color="secondary"
      />
    </div>

    <div>
      <h2 class="mb-3 text-lg font-semibold text-slate-900">Accesos rápidos</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DuiCard v-for="link in quickLinks" :key="link.to" :to="link.to" class="transition-shadow hover:shadow-md">
          <div class="flex flex-col items-start gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i :class="`mdi ${link.icon} text-xl`"></i>
            </div>
            <div>
              <p class="font-medium text-slate-900">{{ link.title }}</p>
              <p class="text-sm text-gray-500">{{ link.description }}</p>
            </div>
          </div>
        </DuiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DuiCard, DuiSkeleton } from '@dronico/droni-kit'
import { api } from '../../services/api'
import type { PaginatedResponse } from '../../types/api'
import type { Minute } from '../../types/minutes'
import StatTile from '../StatTile.vue'
import ParkingRequestsDashboard from '../board/parking-requests/Dashboard.vue'

const minutesTotal = ref(0)
const loading = ref(false)

const quickLinks = [
  { to: '/board/parking-requests', icon: 'mdi-car-outline', title: 'Solicitudes de parqueo', description: 'Revisa y gestiona las solicitudes.' },
  { to: '/board/minutes', icon: 'mdi-file-document-outline', title: 'Actas', description: 'Minutas de las reuniones del consejo.' },
]

async function fetchMinutesTotal() {
  loading.value = true

  try {
    const response = await api.get<PaginatedResponse<Minute>>('/board/minutes', { params: { limit: 1 } })
    minutesTotal.value = response.data.meta?.total ?? 0
  } catch {
    minutesTotal.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(fetchMinutesTotal)
</script>
