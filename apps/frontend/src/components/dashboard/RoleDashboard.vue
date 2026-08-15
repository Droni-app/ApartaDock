<template>
  <component :is="dashboard" />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import UserDashboard from './UserDashboard.vue'
import BoardDashboard from './BoardDashboard.vue'
import AdminDashboard from './AdminDashboard.vue'
import SecurityDashboard from './SecurityDashboard.vue'

const props = defineProps<{ role: string }>()

// Cuando se agregue un rol nuevo (ej. "security" ya vive aquí como adelanto),
// basta con crear su componente de dashboard y registrarlo en este mapa.
const DASHBOARDS_BY_ROLE: Record<string, Component> = {
  user: UserDashboard,
  board: BoardDashboard,
  admin: AdminDashboard,
  security: SecurityDashboard,
}

const dashboard = computed(() => DASHBOARDS_BY_ROLE[props.role] ?? UserDashboard)
</script>
