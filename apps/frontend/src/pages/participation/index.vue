<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Participación</h1>
      <p class="text-sm text-gray-500 dark:text-slate-400">Haz parte de las decisiones del conjunto: asambleas y encuestas.</p>
    </div>

    <DummyPageInfo />

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-poll" label="Encuestas activas" value="2" color="primary" />
      <StatTile icon="mdi-account-check-outline" label="Participación promedio" value="68%" hint="Últimos 3 meses" color="success" />
      <StatTile icon="mdi-calendar-clock-outline" label="Próxima asamblea" value="15 ago" hint="Ordinaria anual" color="secondary" />
      <StatTile icon="mdi-file-certificate-outline" label="Asambleas este año" value="2" color="neutral" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DuiCard to="/participation/surveys" class="transition-shadow hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <DuiBadge color="primary" variant="soft" size="sm">Encuesta activa</DuiBadge>
            <p class="mt-2 font-medium text-slate-900 dark:text-slate-100">¿Apoyas la nueva zona de parqueo para bicicletas?</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">62% de participación - cierra en 4 días</p>
          </div>
          <i class="mdi mdi-chevron-right text-2xl text-gray-400 dark:text-slate-500"></i>
        </div>
      </DuiCard>

      <DuiCard to="/participation/assemblies" class="transition-shadow hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <DuiBadge color="secondary" variant="soft" size="sm">Próxima asamblea</DuiBadge>
            <p class="mt-2 font-medium text-slate-900 dark:text-slate-100">Asamblea ordinaria anual 2026</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">15 de agosto - 6:00 p.m. - Salón comunal</p>
          </div>
          <i class="mdi mdi-chevron-right text-2xl text-gray-400 dark:text-slate-500"></i>
        </div>
      </DuiCard>
    </div>

    <DuiCard title="Actividad reciente">
      <ul class="divide-y divide-gray-100">
        <li v-for="item in activity" :key="item.title" class="flex items-start gap-3 py-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-950 text-slate-600">
            <i :class="`mdi ${item.icon}`"></i>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-slate-900 dark:text-slate-100">{{ item.title }}</p>
            <p class="text-xs text-gray-400 dark:text-slate-500">{{ item.date }}</p>
          </div>
        </li>
      </ul>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { DuiBadge, DuiCard } from '@dronico/droni-kit'
import StatTile from '../../components/StatTile.vue'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

const activity = [
  { icon: 'mdi-vote-outline', title: 'Votaste en la encuesta "Horario de zonas comunes"', date: '20 jul 2026' },
  { icon: 'mdi-file-certificate-outline', title: 'Se publicó el acta de la asamblea de julio', date: '15 jul 2026' },
  { icon: 'mdi-poll', title: 'Nueva encuesta: "Nueva zona de parqueo para bicicletas"', date: '10 jul 2026' },
]
</script>
