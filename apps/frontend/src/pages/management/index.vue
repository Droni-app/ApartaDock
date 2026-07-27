<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900">Gestión</h1>
      <p class="text-sm text-gray-500">Administra tus unidades, cartera, reservas, vehículos y autorizaciones.</p>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-home-city-outline" label="Mis unidades" value="2" hint="Torre 3 - Apto 101 y 305" color="primary" />
      <StatTile icon="mdi-currency-usd" label="Saldo pendiente" value="$186.400" hint="Vence en 8 días" color="danger" />
      <StatTile icon="mdi-calendar-check-outline" label="Reservas activas" value="1" hint="Salón comunal - 2 ago" color="success" />
      <StatTile icon="mdi-car-outline" label="Vehículos registrados" value="2" hint="1 carro, 1 moto" color="secondary" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <DuiCard
        v-for="link in quickLinks"
        :key="link.to"
        :to="link.to"
        class="transition-shadow hover:shadow-md"
      >
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

    <DuiCard title="Próximos vencimientos" subtitle="No olvides estas fechas importantes">
      <ul class="divide-y divide-gray-100">
        <li v-for="item in upcoming" :key="item.title" class="flex items-center justify-between py-3">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <i :class="`mdi ${item.icon}`"></i>
            </div>
            <div>
              <p class="font-medium text-slate-900">{{ item.title }}</p>
              <p class="text-sm text-gray-500">{{ item.description }}</p>
            </div>
          </div>
          <DuiBadge :color="item.badgeColor" variant="soft">{{ item.date }}</DuiBadge>
        </li>
      </ul>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { DuiBadge, DuiCard } from '@dronico/droni-kit'
import StatTile from '../../components/StatTile.vue'

const quickLinks = [
  { to: '/management/units', icon: 'mdi-home-city-outline', title: 'Unidades', description: 'Tus unidades y su información.' },
  { to: '/management/account-status', icon: 'mdi-file-chart-outline', title: 'Estado de cuenta', description: 'Cartera, pagos y cargos.' },
  { to: '/management/reservations', icon: 'mdi-calendar-check-outline', title: 'Reservas', description: 'Zonas comunes disponibles.' },
  { to: '/management/vehicles', icon: 'mdi-car-outline', title: 'Vehículos', description: 'Vehículos registrados.' },
  { to: '/management/authorizations', icon: 'mdi-badge-account-outline', title: 'Autorizaciones', description: 'Ingreso de visitantes.' },
]

const upcoming = [
  {
    icon: 'mdi-currency-usd',
    title: 'Cuota de administración - agosto',
    description: 'Torre 3, Apto 101',
    date: '5 ago',
    badgeColor: 'danger' as const,
  },
  {
    icon: 'mdi-calendar-star',
    title: 'Reserva confirmada - Salón comunal',
    description: '4:00 p.m. - 8:00 p.m.',
    date: '2 ago',
    badgeColor: 'success' as const,
  },
  {
    icon: 'mdi-car-clock',
    title: 'Renovación tarjeta de parqueadero',
    description: 'Vehículo placa ABC-123',
    date: '15 ago',
    badgeColor: 'warning' as const,
  },
]
</script>
