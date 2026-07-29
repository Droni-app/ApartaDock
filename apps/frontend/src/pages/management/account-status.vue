<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Estado de cuenta</h1>
        <p class="text-sm text-gray-500">Unidad 101 - Torre 3</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/management">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Gestión
      </DuiButton>
    </div>

    <DummyPageInfo />

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-currency-usd" label="Saldo actual" value="$186.400" hint="Incluye intereses" color="danger" />
      <StatTile icon="mdi-calendar-alert-outline" label="Próximo vencimiento" value="5 ago" hint="Cuota de agosto" color="warning" />
      <StatTile icon="mdi-cash-check" label="Total pagado 2026" value="$1.240.000" hint="Enero - julio" color="success" />
      <StatTile icon="mdi-shield-check-outline" label="Estado" value="Al día" hint="Sin cartera vencida > 60 días" color="primary" />
    </div>

    <DuiCard title="Evolución del saldo" subtitle="Últimos 6 meses">
      <div class="h-72">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </DuiCard>

    <DuiCard title="Movimientos recientes">
      <DuiTable :columns="columns" :rows="movements">
        <template #concept="row">
          <div class="flex items-center gap-2">
            <i
              :class="`mdi ${row.movementType === 'Pago' ? 'mdi-cash-check' : 'mdi-file-document-outline'} text-lg`"
              :style="{ color: row.movementType === 'Pago' ? '#0ca30c' : '#52514e' }"
            ></i>
            <span class="text-slate-900">{{ row.concept }}</span>
          </div>
        </template>
        <template #amount="row">
          <span :class="row.movementType === 'Pago' ? 'text-emerald-600' : 'text-slate-900'">
            {{ row.movementType === 'Pago' ? '-' : '' }}{{ row.amount }}
          </span>
        </template>
        <template #status="row">
          <DuiBadge :color="row.statusColor" variant="soft" size="sm">{{ row.status }}</DuiBadge>
        </template>
      </DuiTable>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { DuiBadge, DuiButton, DuiCard, DuiTable } from '@dronico/droni-kit'
import StatTile from '../../components/StatTile.vue'
import DummyPageInfo from '../../components/DummyPageInfo.vue'
import { baseChartOptions, CATEGORICAL_COLORS } from '../../utils/charts'

const columns = [
  { name: 'date', label: 'Fecha' },
  { name: 'concept', label: 'Concepto' },
  { name: 'amount', label: 'Valor' },
  { name: 'status', label: 'Estado' },
]

const movements = [
  { date: '01 jul 2026', concept: 'Cuota de administración - julio', movementType: 'Cargo', amount: '$210.000', status: 'Pendiente', statusColor: 'danger' as const },
  { date: '28 jun 2026', concept: 'Pago cuota junio', movementType: 'Pago', amount: '$210.000', status: 'Aplicado', statusColor: 'success' as const },
  { date: '01 jun 2026', concept: 'Cuota de administración - junio', movementType: 'Cargo', amount: '$210.000', status: 'Pagado', statusColor: 'success' as const },
  { date: '15 may 2026', concept: 'Cuota extraordinaria - fachada', movementType: 'Cargo', amount: '$95.000', status: 'Pagado', statusColor: 'success' as const },
  { date: '01 may 2026', concept: 'Cuota de administración - mayo', movementType: 'Cargo', amount: '$205.000', status: 'Pagado', statusColor: 'success' as const },
]

const chartData = {
  labels: ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Saldo pendiente',
      data: [95000, 40000, 0, 95000, 0, 186400],
      borderColor: CATEGORICAL_COLORS[0],
      backgroundColor: 'rgba(42, 120, 214, 0.12)',
      fill: true,
      tension: 0.35,
      pointBackgroundColor: CATEGORICAL_COLORS[0],
      pointRadius: 4,
    },
  ],
}

const chartOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    tooltip: {
      ...baseChartOptions.plugins.tooltip,
      callbacks: {
        label: (ctx: { parsed: { y: number | null } }) => `$${(ctx.parsed.y ?? 0).toLocaleString('es-CO')}`,
      },
    },
  },
}
</script>
