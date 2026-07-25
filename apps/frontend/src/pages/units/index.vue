<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DuiAction, DuiBadge, DuiButton, DuiCard, DuiNavbar } from '@dronico/droni-kit'
import { useAuth } from '../../composables/useAuth'

const { user, logout } = useAuth()
const router = useRouter()

const items = [
  { label: 'Unidades', to: '/units', active: true },
  { label: 'Mis vehiculos', to: user.value ? `/users/${user.value.id}/vehicles` : '/users/1/vehicles' },
]

function signOut() {
  logout()
  router.push('/auth/login')
}
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-4 sm:p-6">
    <div class="mx-auto w-full max-w-6xl space-y-4">
      <DuiNavbar :items="items" underline-color="primary">
        <template #brand>
          <span class="font-semibold text-slate-900">Apartacho</span>
        </template>

        <template #actions>
          <DuiButton color="danger" variant="outline" size="sm" @click="signOut">
            Cerrar sesion
          </DuiButton>
        </template>
      </DuiNavbar>

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
    </div>
  </main>
</template>
