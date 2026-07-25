<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DuiAction, DuiBadge, DuiButton, DuiCard, DuiNavbar } from '@dronico/droni-kit'
import { useAuth } from '../../composables/useAuth'

const { user, logout } = useAuth()
const router = useRouter()

function signOut() {
  logout()
  router.push('/auth/login')
}
</script>

<template>
  <DuiCard
    size="l"
    title="Unidades"
    :subtitle="`Bienvenido, ${user?.fullName || user?.email}`"
  >
    <div class="space-y-4">
      <DuiBadge color="primary" variant="outline">Panel privado</DuiBadge>
      <p class="text-slate-700">
        Esta pantalla representa la ruta generada automaticamente por archivo:
        <strong>/units</strong> -> <strong>/pages/units/index.vue</strong>
      </p>
    </div>

    <template #footer>
      <DuiAction :to="user ? `/users/${user.id}/vehicles` : '/users/1/vehicles'" color="primary">
        Ver vehiculos del usuario
      </DuiAction>
    </template>
  </DuiCard>
</template>
