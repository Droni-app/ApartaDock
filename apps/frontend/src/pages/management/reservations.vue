<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Reservas</h1>
        <p class="text-sm text-gray-500 dark:text-slate-400">Reserva las zonas comunes del conjunto.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/management">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Gestión
      </DuiButton>
    </div>

    <DummyPageInfo />

    <DuiTabs v-model="activeTab" :tabs="tabs" />

    <div v-if="activeTab === 'spaces'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DuiCard v-for="space in spaces" :key="space.name">
        <div class="flex items-start justify-between">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <i :class="`mdi ${space.icon} text-2xl`"></i>
          </div>
          <DuiBadge :color="space.available ? 'success' : 'neutral'" variant="soft" size="sm">
            {{ space.available ? 'Disponible' : 'Ocupado hoy' }}
          </DuiBadge>
        </div>
        <p class="mt-3 font-medium text-slate-900 dark:text-slate-100">{{ space.name }}</p>
        <p class="text-sm text-gray-500 dark:text-slate-400">{{ space.description }}</p>
        <p class="mt-2 text-xs text-gray-400 dark:text-slate-500">
          <i class="mdi mdi-clock-outline mr-1"></i>{{ space.hours }}
        </p>
        <DuiButton class="mt-4" size="sm" color="primary" block>Reservar</DuiButton>
      </DuiCard>
    </div>

    <DuiCard v-else title="Mis reservas">
      <DuiTable :columns="columns" :rows="myReservations">
        <template #status="row">
          <DuiBadge :color="row.statusColor" variant="soft" size="sm">{{ row.status }}</DuiBadge>
        </template>
        <template #actions="row">
          <DuiButton v-if="row.status === 'Confirmada'" size="sm" variant="ghost" color="danger">Cancelar</DuiButton>
        </template>
      </DuiTable>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuiBadge, DuiButton, DuiCard, DuiTable, DuiTabs } from '@dronico/droni-kit'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

const tabs = [
  { label: 'Espacios disponibles', value: 'spaces' },
  { label: 'Mis reservas', value: 'mine' },
]

const activeTab = ref('spaces')

const spaces = [
  { name: 'Salón comunal', icon: 'mdi-sofa-outline', description: 'Capacidad para 60 personas', hours: '8:00 a.m. - 10:00 p.m.', available: true },
  { name: 'Zona BBQ', icon: 'mdi-grill-outline', description: 'Zona techada con parrilla', hours: '11:00 a.m. - 11:00 p.m.', available: true },
  { name: 'Gimnasio', icon: 'mdi-dumbbell', description: 'Máximo 8 personas simultáneas', hours: '5:00 a.m. - 9:00 p.m.', available: false },
  { name: 'Piscina', icon: 'mdi-pool', description: 'Uso recreativo por turnos', hours: '9:00 a.m. - 6:00 p.m.', available: true },
  { name: 'Cancha múltiple', icon: 'mdi-basketball', description: 'Fútbol, baloncesto y voleibol', hours: '6:00 a.m. - 9:00 p.m.', available: true },
  { name: 'Sala de juegos', icon: 'mdi-billiards-rack', description: 'Billar, ping pong y juegos de mesa', hours: '2:00 p.m. - 9:00 p.m.', available: false },
]

const columns = [
  { name: 'space', label: 'Espacio' },
  { name: 'date', label: 'Fecha' },
  { name: 'time', label: 'Horario' },
  { name: 'status', label: 'Estado' },
  { name: 'actions', label: '' },
]

const myReservations = [
  { space: 'Salón comunal', date: '2 ago 2026', time: '4:00 p.m. - 8:00 p.m.', status: 'Confirmada', statusColor: 'success' as const },
  { space: 'Zona BBQ', date: '9 ago 2026', time: '12:00 m. - 4:00 p.m.', status: 'Pendiente', statusColor: 'warning' as const },
  { space: 'Cancha múltiple', date: '15 jul 2026', time: '6:00 p.m. - 7:00 p.m.', status: 'Finalizada', statusColor: 'neutral' as const },
]
</script>
