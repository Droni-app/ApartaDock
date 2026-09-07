

<template>
  <DuiCard :title="visitor?.unit?.name">
    <div class="md:grid grid-cols-2 gap-4">
      <div>
        <strong>Unidad:</strong> {{ visitor?.fullName }}<br />
        <strong>Vehículo:</strong> {{ visitor?.plate ?? '-' }}
      </div>
      <div>
        <strong>Ingreso:</strong> {{ formatDate(visitor.checkinDate) }}<br />
        <strong>Salida:</strong> {{ formatDate(visitor.checkoutDate) ?? '-' }}
      </div>
    </div>
  </DuiCard>
</template>
<script setup lang="ts">
import { DuiCard } from '@dronico/droni-kit';
import type { Visitor } from '@/types/security/visitors'
import { formatDate } from '@/services/utils'

const props = defineProps<{
  visitor: Visitor
}>()

</script>