<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Vehículos</h1>
        <p class="text-sm text-gray-500">Vehículos registrados en tus unidades.</p>
      </div>
      <div class="flex gap-2">
        <DuiButton variant="outline" color="neutral" to="/management">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Gestión
        </DuiButton>
        <DuiButton color="primary">
          <i class="mdi mdi-plus mr-1"></i>
          Registrar vehículo
        </DuiButton>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <DuiCard v-for="vehicle in vehicles" :key="vehicle.plate">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <i :class="`mdi ${vehicle.icon} text-3xl`"></i>
          </div>
          <div class="flex-1">
            <p class="text-lg font-semibold tracking-wide text-slate-900">{{ vehicle.plate }}</p>
            <p class="text-sm text-gray-500">{{ vehicle.type }} - {{ vehicle.color }}</p>
          </div>
          <DuiBadge color="primary" variant="soft">{{ vehicle.parking }}</DuiBadge>
        </div>
        <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
          <div>
            <dt class="text-xs uppercase text-gray-400">Propietario</dt>
            <dd class="text-slate-900">{{ vehicle.owner }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase text-gray-400">Unidad</dt>
            <dd class="text-slate-900">{{ vehicle.unit }}</dd>
          </div>
        </dl>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit'

const vehicles = [
  { plate: 'ABC-123', type: 'Automóvil', color: 'Gris', icon: 'mdi-car-outline', parking: 'P-14', owner: 'Administrador General', unit: '101 - Torre 3' },
  { plate: 'XYZ-987', type: 'Motocicleta', color: 'Negro', icon: 'mdi-motorbike', parking: 'M-06', owner: 'Administrador General', unit: '101 - Torre 3' },
]
</script>
