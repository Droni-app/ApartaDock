<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Encuestas</h1>
        <p class="text-sm text-gray-500">Participa en las decisiones del conjunto residencial.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/participation">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Participación
      </DuiButton>
    </div>

    <DuiCard>
      <div class="flex items-center justify-between">
        <DuiBadge color="primary" variant="soft">Encuesta activa</DuiBadge>
        <span class="text-sm text-gray-400">Cierra en 4 días</span>
      </div>
      <p class="mt-3 text-lg font-medium text-slate-900">
        ¿Apoyas la construcción de una nueva zona de parqueo para bicicletas?
      </p>

      <div class="mt-4 space-y-3">
        <button
          v-for="option in activeSurveyOptions"
          :key="option.label"
          type="button"
          class="w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-blue-400 hover:bg-blue-50/50"
          :class="{ 'border-blue-500 bg-blue-50/60': selectedOption === option.label }"
          @click="selectedOption = option.label"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium text-slate-900">{{ option.label }}</span>
            <span class="text-gray-500">{{ option.percentage }}%</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div class="h-full rounded-full bg-blue-500" :style="{ width: `${option.percentage}%` }"></div>
          </div>
        </button>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          <i class="mdi mdi-account-multiple-outline mr-1"></i>
          62% de participación - 186 de 300 unidades
        </p>
        <DuiButton color="primary" :disabled="!selectedOption">Votar</DuiButton>
      </div>
    </DuiCard>

    <DuiCard title="Encuestas cerradas" subtitle="Resultados finales">
      <DuiTabs v-model="activeClosedSurvey" :tabs="closedSurveyTabs" class="mb-4" />
      <div class="h-64">
        <Bar :data="closedSurveyChart.data" :options="chartOptions" />
      </div>
      <p class="mt-3 text-center text-sm text-gray-500">{{ closedSurveyChart.summary }}</p>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { DuiBadge, DuiButton, DuiCard, DuiTabs } from '@dronico/droni-kit'
import { baseChartOptions, CATEGORICAL_COLORS } from '../../utils/charts'

const selectedOption = ref<string | null>(null)

const activeSurveyOptions = [
  { label: 'Sí, apoyo la propuesta', percentage: 58 },
  { label: 'No, prefiero otra alternativa', percentage: 27 },
  { label: 'Me es indiferente', percentage: 15 },
]

const closedSurveyTabs = [
  { label: 'Horario de zonas comunes', value: 'schedule' },
  { label: 'Reglamento de mascotas', value: 'pets' },
]

const activeClosedSurvey = ref('schedule')

const closedSurveys: Record<string, { labels: string[]; data: number[]; summary: string }> = {
  schedule: {
    labels: ['Extender hasta 11 p.m.', 'Mantener horario actual', 'Extender hasta 9 p.m.'],
    data: [64, 22, 14],
    summary: '312 votos - cerrada el 18 jul 2026',
  },
  pets: {
    labels: ['Aprobar reglamento', 'Rechazar reglamento', 'Requiere ajustes'],
    data: [48, 12, 40],
    summary: '298 votos - cerrada el 30 jun 2026',
  },
}

const closedSurveyChart = computed(() => {
  const survey = closedSurveys[activeClosedSurvey.value]
  return {
    summary: survey.summary,
    data: {
      labels: survey.labels,
      datasets: [
        {
          label: 'Votos (%)',
          data: survey.data,
          backgroundColor: [CATEGORICAL_COLORS[0], CATEGORICAL_COLORS[7], CATEGORICAL_COLORS[3]],
          borderRadius: 4,
        },
      ],
    },
  }
})

const chartOptions = {
  ...baseChartOptions,
  indexAxis: 'y' as const,
  plugins: { ...baseChartOptions.plugins, legend: { display: false } },
  scales: {
    x: baseChartOptions.scales.y,
    y: baseChartOptions.scales.x,
  },
}
</script>
