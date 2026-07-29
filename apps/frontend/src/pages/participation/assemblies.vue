<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Asambleas</h1>
        <p class="text-sm text-gray-500">Convocatorias, orden del día y resultados de asambleas.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/participation">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Participación
      </DuiButton>
    </div>

    <DummyPageInfo />

    <DuiCard>
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <DuiBadge color="secondary" variant="soft" size="sm">Próxima asamblea</DuiBadge>
          <p class="mt-2 text-lg font-semibold text-slate-900">Asamblea ordinaria anual 2026</p>
          <p class="text-sm text-gray-500">
            <i class="mdi mdi-calendar-outline mr-1"></i>15 de agosto de 2026, 6:00 p.m.
            <span class="mx-2">·</span>
            <i class="mdi mdi-map-marker-outline mr-1"></i>Salón comunal
          </p>
        </div>
        <DuiButton color="primary">
          <i class="mdi mdi-check-circle-outline mr-1"></i>
          Confirmar asistencia
        </DuiButton>
      </div>

      <DuiAccordion class="mt-4" :items="agendaItems" />
    </DuiCard>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DuiCard title="Quórum - asamblea julio 2026">
        <div class="h-64">
          <Doughnut :data="quorumData" :options="quorumOptions" />
        </div>
        <p class="mt-3 text-center text-sm text-gray-500">78% de participación - quórum decisorio alcanzado</p>
      </DuiCard>

      <DuiCard title="Historial de asambleas">
        <ul class="divide-y divide-gray-100">
          <li v-for="item in history" :key="item.title" class="flex items-start gap-3 py-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <i class="mdi mdi-file-certificate-outline"></i>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-slate-900">{{ item.title }}</p>
              <p class="text-sm text-gray-500">{{ item.date }} - Quórum {{ item.quorum }}</p>
            </div>
            <DuiBadge color="neutral" variant="soft" size="sm">{{ item.type }}</DuiBadge>
          </li>
        </ul>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { DuiAccordion, DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit'
import { CATEGORICAL_COLORS } from '../../utils/charts'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

const agendaItems = [
  {
    title: '1. Verificación de quórum',
    content: 'Verificación del quórum deliberatorio y decisorio para la instalación de la asamblea.',
  },
  {
    title: '2. Presentación de estados financieros 2025',
    content: 'Presentación y aprobación de los estados financieros del ejercicio 2025.',
  },
  {
    title: '3. Aprobación de presupuesto 2027',
    content: 'Discusión y votación del presupuesto de ingresos y gastos para la vigencia 2027.',
  },
  {
    title: '4. Elección de consejo de administración',
    content: 'Elección de los miembros del consejo de administración para el período 2026-2027.',
  },
  {
    title: '5. Proposiciones y varios',
    content: 'Espacio para proposiciones de los propietarios y asuntos varios.',
  },
]

const quorumData = {
  labels: ['Asistieron', 'No asistieron'],
  datasets: [
    {
      data: [78, 22],
      backgroundColor: [CATEGORICAL_COLORS[0], '#e1e0d9'],
      borderWidth: 0,
    },
  ],
}

const quorumOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { position: 'bottom' as const, labels: { color: '#52514e', usePointStyle: true, boxWidth: 8 } },
  },
}

const history = [
  { title: 'Asamblea ordinaria anual 2026', date: '12 jul 2026', quorum: '78%', type: 'Ordinaria' },
  { title: 'Asamblea extraordinaria - presupuesto fachada', date: '05 may 2026', quorum: '65%', type: 'Extraordinaria' },
  { title: 'Asamblea ordinaria anual 2025', date: '18 jul 2025', quorum: '71%', type: 'Ordinaria' },
]
</script>
