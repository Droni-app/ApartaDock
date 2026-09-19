<template>
  <DuiCard :title="ticket.name">

  </DuiCard>
</template>
<script setup lang="ts">
import { DuiCard } from '@dronico/droni-kit';
import type { Ticket } from '@/types/user/tickets';
const props = defineProps<{
  ticket: Ticket
}>()


</script>
