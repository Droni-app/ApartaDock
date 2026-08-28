<template>
  <DuiCard class="flex">
    <i class="mdi mdi-account-key" />
    <div>
      {{ authorization }}
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
