<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Documentos</h1>
        <p class="text-sm text-gray-500">Reglamentos, actas, estados financieros y formatos del conjunto.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/communications">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Comunicaciones
      </DuiButton>
    </div>

    <DummyPageInfo />

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <button
        v-for="folder in folders"
        :key="folder.label"
        type="button"
        class="rounded-xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
        :class="{ 'ring-2 ring-blue-500': activeFolder === folder.label }"
        @click="activeFolder = activeFolder === folder.label ? 'Todos' : folder.label"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <i :class="`mdi ${folder.icon} text-xl`"></i>
        </div>
        <p class="mt-3 font-medium text-slate-900">{{ folder.label }}</p>
        <p class="text-sm text-gray-500">{{ folder.count }} archivos</p>
      </button>
    </div>

    <DuiCard :title="activeFolder === 'Todos' ? 'Todos los documentos' : activeFolder">
      <DuiTable :columns="columns" :rows="tableRows">
        <template #name="row">
          <div class="flex items-center gap-2">
            <i :class="`mdi ${fileIcon(row.type)} text-lg text-gray-500`"></i>
            <span class="text-slate-900">{{ row.name }}</span>
          </div>
        </template>
        <template #actions="row">
          <DuiButton size="sm" variant="ghost" color="primary" :title="`Descargar ${row.name}`">
            <i class="mdi mdi-download-outline"></i>
          </DuiButton>
        </template>
      </DuiTable>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DuiButton, DuiCard, DuiTable } from '@dronico/droni-kit'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

const folders = [
  { label: 'Reglamento', icon: 'mdi-gavel', count: 3 },
  { label: 'Actas de asamblea', icon: 'mdi-file-certificate-outline', count: 18 },
  { label: 'Estados financieros', icon: 'mdi-chart-box-outline', count: 12 },
  { label: 'Formatos', icon: 'mdi-file-edit-outline', count: 14 },
]

const activeFolder = ref('Todos')

const columns = [
  { name: 'name', label: 'Documento' },
  { name: 'category', label: 'Categoría' },
  { name: 'date', label: 'Fecha' },
  { name: 'size', label: 'Tamaño' },
  { name: 'actions', label: '' },
]

const documents = [
  { name: 'Reglamento de propiedad horizontal', category: 'Reglamento', type: 'pdf', date: '02 ene 2026', size: '2.4 MB' },
  { name: 'Manual de convivencia', category: 'Reglamento', type: 'pdf', date: '02 ene 2026', size: '1.1 MB' },
  { name: 'Acta asamblea ordinaria julio 2026', category: 'Actas de asamblea', type: 'pdf', date: '12 jul 2026', size: '860 KB' },
  { name: 'Acta asamblea extraordinaria mayo 2026', category: 'Actas de asamblea', type: 'pdf', date: '05 may 2026', size: '540 KB' },
  { name: 'Estado financiero junio 2026', category: 'Estados financieros', type: 'xls', date: '05 jul 2026', size: '320 KB' },
  { name: 'Presupuesto anual 2026', category: 'Estados financieros', type: 'xls', date: '10 ene 2026', size: '410 KB' },
  { name: 'Formato solicitud de mudanza', category: 'Formatos', type: 'doc', date: '15 mar 2025', size: '80 KB' },
  { name: 'Formato autorización de visitantes', category: 'Formatos', type: 'doc', date: '15 mar 2025', size: '75 KB' },
]

const tableRows = computed(() =>
  activeFolder.value === 'Todos'
    ? documents
    : documents.filter((doc) => doc.category === activeFolder.value)
)

function fileIcon(type: string) {
  if (type === 'xls') return 'mdi-file-excel-outline'
  if (type === 'doc') return 'mdi-file-word-outline'
  return 'mdi-file-pdf-box'
}
</script>
