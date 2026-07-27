<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Mis unidades</h1>
        <p class="text-sm text-gray-500">Unidades donde figuras como propietario o arrendatario.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/management">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Gestión
      </DuiButton>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DuiCard v-for="unit in units" :key="unit.name">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i class="mdi mdi-door text-2xl"></i>
            </div>
            <div>
              <p class="text-lg font-semibold text-slate-900">Unidad {{ unit.name }}</p>
              <p class="text-sm text-gray-500">Torre {{ unit.tower }} - Piso {{ unit.floor }}</p>
            </div>
          </div>
          <DuiBadge :color="unit.roleColor" variant="soft">{{ unit.role }}</DuiBadge>
        </div>

        <dl class="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt class="text-xs uppercase text-gray-400">Área privada</dt>
            <dd class="text-slate-900">{{ unit.privateArea }} m²</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-400">Área construida</dt>
            <dd class="text-slate-900">{{ unit.buildArea }} m²</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-400">Coeficiente</dt>
            <dd class="text-slate-900">{{ unit.coefficient }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-400">Parqueadero</dt>
            <dd class="text-slate-900">{{ unit.parking }}</dd>
          </div>
        </dl>

        <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <i class="mdi mdi-account-multiple-outline"></i>
            {{ unit.residents }} residente(s)
          </div>
          <DuiButton size="sm" variant="outline" color="primary" :to="'/management/account-status'">
            Ver estado de cuenta
          </DuiButton>
        </div>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit'

const units = [
  {
    name: '101',
    tower: 3,
    floor: 1,
    role: 'Propietario',
    roleColor: 'primary' as const,
    privateArea: '36.00',
    buildArea: '41.50',
    coefficient: '0.1113',
    parking: 'P-14',
    residents: 3,
  },
  {
    name: '305',
    tower: 3,
    floor: 3,
    role: 'Arrendatario',
    roleColor: 'secondary' as const,
    privateArea: '58.20',
    buildArea: '64.80',
    coefficient: '0.1587',
    parking: 'No asignado',
    residents: 1,
  },
]
</script>
