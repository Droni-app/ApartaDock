

<template>
  <DuiAlert variant="outline" color="secondary" class="mb-3">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold">{{ visitor.fullName }}</h3>
        <p class="text-sm text-gray-500">
          {{ visitor.document }}
          <span v-if="visitor.plate">
            <i class="mdi mdi-car" />
            {{ visitor.plate }}
          </span>
        </p>
      </div>
      <div>
        <DuiButton
          class="ml-2"
          variant="outline"
          color="success"
          @click="$emit('accept', visitor)">
          Aceptar
        </DuiButton>
        <DuiConfirmation
          @confirmed="$emit('reject', visitor)"
          class="ml-2"
          checkLabel="Estoy seguro de rechazar este visitante"
          color="danger"
          confirmLabel="Si, rechazar"
          label="Rechazar"
          size="md"
          variant="outline" />
      </div>
    </div>
  </DuiAlert>
</template>
<script setup lang="ts">
import type { Visitor } from '@/types/security/visitors';
import { DuiAlert, DuiButton, DuiConfirmation } from '@dronico/droni-kit';

const props = defineProps<{
  visitor: Visitor
}>()

defineEmits(['accept', 'reject'])

</script>