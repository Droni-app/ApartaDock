<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Autorizaciones</h1>
        <p class="text-sm text-gray-500">Gestiona el ingreso de visitantes y domicilios a tu unidad.</p>
      </div>
      <div class="flex gap-2">
        <DuiButton variant="outline" color="neutral" to="/management">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Gestión
        </DuiButton>
        <DuiButton color="primary">
          <i class="mdi mdi-plus mr-1"></i>
          Nueva autorización
        </DuiButton>
      </div>
    </div>

    <DummyPageInfo />

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-badge-account-outline" label="Autorizaciones activas" value="4" color="primary" />
      <StatTile icon="mdi-clock-alert-outline" label="Pendientes" value="1" color="warning" />
      <StatTile icon="mdi-calendar-month-outline" label="Este mes" value="9" color="secondary" />
      <StatTile icon="mdi-shield-check-outline" label="Vencidas" value="2" color="neutral" />
    </div>

    <DuiCard title="Historial de autorizaciones">
      <DuiTable :columns="columns" :rows="authorizations">
        <template #visitor="row">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <i class="mdi mdi-account-outline"></i>
            </div>
            <div>
              <p class="text-slate-900">{{ row.visitor }}</p>
              <p class="text-xs text-gray-400">{{ row.document }}</p>
            </div>
          </div>
        </template>
        <template #status="row">
          <DuiBadge :color="row.statusColor" variant="soft" size="sm">{{ row.status }}</DuiBadge>
        </template>
        <template #actions="row">
          <DuiButton v-if="row.status === 'Pendiente'" size="sm" variant="outline" color="success">Aprobar</DuiButton>
        </template>
      </DuiTable>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { DuiBadge, DuiButton, DuiCard, DuiTable } from '@dronico/droni-kit'
import StatTile from '../../components/StatTile.vue'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

const columns = [
  { name: 'visitor', label: 'Visitante' },
  { name: 'type', label: 'Tipo' },
  { name: 'unit', label: 'Unidad destino' },
  { name: 'date', label: 'Fecha' },
  { name: 'status', label: 'Estado' },
  { name: 'actions', label: '' },
]

const authorizations = [
  { visitor: 'Laura Gómez', document: 'CC 1020304050', type: 'Visitante', unit: '101 - Torre 3', date: '25 jul 2026', status: 'Activa', statusColor: 'success' as const },
  { visitor: 'Rappi - Domicilio', document: 'Mensajería', type: 'Domicilio', unit: '101 - Torre 3', date: '25 jul 2026', status: 'Activa', statusColor: 'success' as const },
  { visitor: 'Carlos Pérez', document: 'CC 1030405060', type: 'Visitante', unit: '305 - Torre 3', date: '24 jul 2026', status: 'Pendiente', statusColor: 'warning' as const },
  { visitor: 'Servicio técnico Claro', document: 'CC 900123456', type: 'Proveedor', unit: '101 - Torre 3', date: '20 jul 2026', status: 'Finalizada', statusColor: 'neutral' as const },
  { visitor: 'Andrea Ríos', document: 'CC 1015223344', type: 'Visitante', unit: '101 - Torre 3', date: '10 jul 2026', status: 'Vencida', statusColor: 'danger' as const },
]
</script>
