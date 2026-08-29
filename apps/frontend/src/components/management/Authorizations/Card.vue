<template>
  <DuiCard>
    <div class="flex">
      <div class="text-6xl shrink pe-3">
        <i class="mdi mdi-account-key" />
      </div>
      <div>
        <h3 class="text-xl">
          {{ authorization.fullName }} | {{ authorization.unit.name }}
        </h3>
        <p class="text-sm">
          Documento: {{ authorization.document }}<br />
          Fecha de la autorización: {{ authorization.authorizedDate }}
        </p>
      </div>
    </div>
  </DuiCard>
</template>
<script setup lang="ts">
import { DuiCard } from '@dronico/droni-kit';
import type { Authorization } from '../../../types/user/authorization';

const props = defineProps<{
  authorization: Authorization
}>()

</script>
