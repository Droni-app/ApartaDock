<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DuiButton, DuiNavbar } from '@dronico/droni-kit'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

const items = computed(() => {
  const userId = user.value?.id

  return [
    { label: 'Unidades', to: '/units' },
    { label: 'Vehiculos', to: userId ? `/users/${userId}/vehicles` : '/units' },
  ]
})

function signOut() {
  logout()
  router.push('/auth/login')
}
</script>

<template>
  <header>
    <DuiNavbar :items="items" underline-color="primary">
      <template #brand>
        <span class="font-semibold text-slate-900">Apartacho</span>
      </template>

      <template #actions>
        <DuiButton size="sm" color="danger" variant="outline" @click="signOut">
          Cerrar sesion
        </DuiButton>
      </template>
    </DuiNavbar>
  </header>
</template>
