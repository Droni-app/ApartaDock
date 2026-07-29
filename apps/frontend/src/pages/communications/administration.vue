<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Administración</h1>
        <p class="text-sm text-gray-500">Comunicados, circulares y actas publicadas por la administración.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/communications">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Comunicaciones
      </DuiButton>
    </div>

    <DummyPageInfo />

    <DuiCard title="Comunicados enviados por mes" subtitle="Últimos 6 meses, por categoría">
      <div class="h-72">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </DuiCard>

    <DuiCard>
      <DuiTabs v-model="activeTab" :tabs="tabs" class="mb-4" />

      <ul class="divide-y divide-gray-100">
        <li v-for="item in filteredItems" :key="item.title" class="flex items-start gap-4 py-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" :class="categoryStyles[item.category].bg">
            <i :class="`mdi ${categoryStyles[item.category].icon} text-lg`" :style="{ color: categoryStyles[item.category].color }"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-medium text-slate-900">{{ item.title }}</p>
              <DuiBadge size="sm" variant="soft" :color="categoryStyles[item.category].badge">{{ item.category }}</DuiBadge>
              <DuiBadge v-if="!item.read" size="sm" color="danger">Nuevo</DuiBadge>
            </div>
            <p class="mt-1 text-sm text-gray-500">{{ item.excerpt }}</p>
            <div class="mt-2 flex items-center gap-3 text-xs text-gray-400">
              <span><i class="mdi mdi-calendar-outline mr-1"></i>{{ item.date }}</span>
              <span><i class="mdi mdi-account-outline mr-1"></i>{{ item.author }}</span>
            </div>
          </div>
          <DuiButton size="sm" variant="ghost" color="primary">Leer más</DuiButton>
        </li>
      </ul>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { DuiBadge, DuiButton, DuiCard, DuiTabs } from '@dronico/droni-kit'
import { baseChartOptions, CATEGORICAL_COLORS } from '../../utils/charts'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

type Category = 'Comunicados' | 'Circulares' | 'Actas'

const tabs = [
  { label: 'Todos', value: 'all' },
  { label: 'Comunicados', value: 'Comunicados' },
  { label: 'Circulares', value: 'Circulares' },
  { label: 'Actas', value: 'Actas' },
]

const activeTab = ref('all')

const categoryStyles: Record<Category, { icon: string; bg: string; color: string; badge: 'primary' | 'warning' | 'secondary' }> = {
  Comunicados: { icon: 'mdi-bullhorn-outline', bg: 'bg-blue-50', color: CATEGORICAL_COLORS[0], badge: 'primary' },
  Circulares: { icon: 'mdi-file-sign', bg: 'bg-amber-50', color: '#eda100', badge: 'warning' },
  Actas: { icon: 'mdi-file-certificate-outline', bg: 'bg-violet-50', color: CATEGORICAL_COLORS[6], badge: 'secondary' },
}

const items: Array<{
  title: string
  category: Category
  excerpt: string
  date: string
  author: string
  read: boolean
}> = [
  {
    title: 'Corte programado de agua - Torre 3',
    category: 'Comunicados',
    excerpt: 'El sábado 26 de julio se suspenderá el servicio de 8:00 a.m. a 12:00 m. para labores de mantenimiento en el tanque de reserva.',
    date: '25 jul 2026',
    author: 'Administración',
    read: false,
  },
  {
    title: 'Circular 014 - Nuevo horario de zonas comunes',
    category: 'Circulares',
    excerpt: 'A partir de agosto el salón social y la zona BBQ tendrán horario extendido los fines de semana hasta las 11:00 p.m.',
    date: '22 jul 2026',
    author: 'Consejo de administración',
    read: true,
  },
  {
    title: 'Acta de asamblea ordinaria 2026 disponible',
    category: 'Actas',
    excerpt: 'Ya puedes consultar el acta y los acuerdos de la asamblea realizada el 12 de julio en la sección de documentos.',
    date: '20 jul 2026',
    author: 'Secretaría',
    read: false,
  },
  {
    title: 'Circular 013 - Prevención de plagas',
    category: 'Circulares',
    excerpt: 'Recomendaciones para el manejo de residuos y prevención de plagas en las unidades residenciales.',
    date: '15 jul 2026',
    author: 'Administración',
    read: true,
  },
  {
    title: 'Comunicado: mantenimiento de ascensores torre 1 y 2',
    category: 'Comunicados',
    excerpt: 'Se realizará mantenimiento preventivo de ascensores entre el 28 y el 30 de julio. Habrá disponibilidad parcial.',
    date: '10 jul 2026',
    author: 'Administración',
    read: true,
  },
  {
    title: 'Acta reunión extraordinaria de consejo',
    category: 'Actas',
    excerpt: 'Resumen de decisiones tomadas en la reunión extraordinaria sobre el presupuesto de mantenimiento 2026.',
    date: '2 jul 2026',
    author: 'Secretaría',
    read: true,
  },
]

const filteredItems = computed(() =>
  activeTab.value === 'all' ? items : items.filter((item) => item.category === activeTab.value)
)

const chartData = {
  labels: ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
  datasets: [
    { label: 'Comunicados', data: [4, 6, 5, 7, 6, 8], backgroundColor: CATEGORICAL_COLORS[0], borderRadius: 4 },
    { label: 'Circulares', data: [2, 1, 3, 2, 2, 3], backgroundColor: '#eda100', borderRadius: 4 },
    { label: 'Actas', data: [1, 1, 1, 2, 1, 1], backgroundColor: CATEGORICAL_COLORS[6], borderRadius: 4 },
  ],
}

const chartOptions = {
  ...baseChartOptions,
  scales: {
    ...baseChartOptions.scales,
    x: { ...baseChartOptions.scales.x, stacked: true },
    y: { ...baseChartOptions.scales.y, stacked: true },
  },
}
</script>
