<template>
  <DuiCard>
    <div class="flex">
      <div class="text-6xl shrink pe-3">
        <i :class="`mdi ${vehicleTypeIcon(vehicle.vehicleType)}`" />
      </div>
      <div class="flex-1">
        <h3 class="text-xl">
          {{ vehicle.plate ?? 'Sin placa' }}
        </h3>
        <p class="text-sm">
          {{ vehicleTypeLabel(vehicle.vehicleType) }}
          <span v-if="vehicle.brand || vehicle.model">- {{ vehicle.brand }} {{ vehicle.model }}</span><br />
          Propietario: {{ vehicle.ownerName }}
        </p>
      </div>
      <DuiBadge :color="vehicle.isOwner ? 'primary' : 'secondary'" variant="soft">
        {{ vehicle.isOwner ? 'Propietario' : 'No propietario' }}
      </DuiBadge>
    </div>
    <div class="mt-3 flex justify-end">
      <DuiButton size="sm" variant="outline" color="primary" @click="emit('edit', vehicle)">
        <i class="mdi mdi-pencil" />
        Editar
      </DuiButton>
    </div>
  </DuiCard>
</template>
<script setup lang="ts">
import { DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit';
import { vehicleTypeIcon, vehicleTypeLabel } from '../../../utils/vehicles.ts';
import type { Vehicle } from '../../../types/vehicles.ts';

defineProps<{
  vehicle: Vehicle
}>()

const emit = defineEmits<{
  edit: [vehicle: Vehicle]
}>()
</script>
