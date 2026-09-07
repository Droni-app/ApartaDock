

<template>
  <DuiCard :title="`${visitor.unit?.tower} - ${visitor.unit?.apto} | ${visitor.fullName}`">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <i class="mdi mdi-card-account-details-outline" />
        <span>{{ visitor.document }}</span>
      </div>
      <div v-if="visitor.plate" class="flex items-center gap-2">
        <i class="mdi mdi-car" />
        <span>{{ visitor.plate || 'Sin placa' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="mdi mdi-clock-check-outline" />
        <span>Ingreso: {{ formatDate(visitor.checkinDate) }}</span>
      </div>
      <div v-if="visitor.checkoutDate" class="flex items-center gap-2">
        <i class="mdi mdi-clock-remove-outline" />
        <span>Salida: {{ formatDate(visitor.checkoutDate) }}</span>
      </div>
    </div>
    <template #footer>
      <DuiButton
        v-if="visitor.checkinDate && !visitor.checkoutDate"
        block
        variant="outline"
        color="warning"
        rounded="none"
        size="lg"
        @click="$emit('checkout', visitor)"
      >
        <i class="mdi mdi-clock-remove-outline"></i>
        Registrar salida
      </DuiButton>
      <DuiButton
        v-if="!visitor.checkinDate && visitor.authorizationId"
        block
        variant="outline"
        color="success"
        rounded="none"
        size="lg"
        @click="$emit('checkin', visitor)"
      >
        <i class="mdi mdi-clock-remove-outline"></i>
        Autorizar ingreso
      </DuiButton>
    </template>
  </DuiCard>
</template>
<script setup lang="ts">
import { DuiCard, DuiButton } from '@dronico/droni-kit';
import type { Visitor } from '@/types/security/visitors'
import { formatDate } from '@/services/utils'

const props = defineProps<{
  visitor: Visitor
}>()

defineEmits(['checkout', 'checkin'])

</script>