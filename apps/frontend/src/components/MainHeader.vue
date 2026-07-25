<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DuiButton, DuiNavbar } from '@dronico/droni-kit'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

function signOut() {
  logout()
  router.push('/auth/login')
}
/*
Menu principal

Gestion:
- Unidades
- Estado de cuenta
- Reservas
- Vehiculos
- Autorizaciones

Comunicacion:
- Administracion
- Documentos
- Notificaciones

Participacion:
- Asambleas
- Encuestas

Social:
- Noticias y eventos
- Clasificados

*/
</script>

<template>
  <header class="z-10 sticky top-0 bg-slate-100 shadow-sm">
    <DuiNavbar :items="[
      {
        label: 'Gestión',
        icon: 'mdi mdi-office-building-cog-outline',
        to: '/management',
        children: [
          { label: 'Unidades', to: '/management/units' },
          { label: 'Estado de cuenta', to: '/management/account-status' },
          { label: 'Reservas', to: '/management/reservations' },
          { label: 'Vehículos', to: '/management/vehicles' },
          { label: 'Autorizaciones', to: '/management/authorizations' },
        ],
      },
      { 
        label: 'Comunicaciones',
        icon: 'mdi mdi-message-text',
        to: '/communications',
        children: [
          { label: 'Administración', to: '/communications/administration' },
          { label: 'Documentos', to: '/communications/documents' },
          { label: 'Notificaciones', to: '/communications/notifications' },
        ],
      },
      {
        label: 'Participación',
        icon: 'mdi mdi-vote-outline',
        to: '/participation',
        children: [
          { label: 'Asambleas', to: '/participation/assemblies' },
          { label: 'Encuestas', to: '/participation/surveys' },
        ],
      },
      {
        label: 'Social',
        icon: 'mdi mdi-account-group',
        to: '/social',
        children: [
          { label: 'Noticias y eventos', to: '/social/news-events' },
          { label: 'Clasificados', to: '/social/classifieds' },
        ],
      },
    ]"
    underline-color="primary">
      <template #brand>
        <RouterLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/logo.webp"
            alt="Apartacho logo"
            class="h-8 w-8 rounded object-contain"
          />
          <span class="text-xs leading-tight text-slate-900">Fontibón<br />Reservado</span>
        </RouterLink>
      </template>

      <template #actions>
        <DuiButton to="/admin" size="sm" color="primary" variant="outline">
          <i class="mdi mdi-cog-outline mr-1"></i>
          Administrar
        </DuiButton>
        <DuiButton size="sm" color="danger" variant="outline" @click="signOut">
          Cerrar sesion
        </DuiButton>
      </template>
    </DuiNavbar>
  </header>
</template>
