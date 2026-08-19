<template>
  <header class="z-1 sticky top-0 bg-slate-100 shadow-sm">
    <DuiNavbar :items="navItems"
    underline-color="primary">
      <template #brand>
        <RouterLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/logo.webp"
            alt="ApartaDock logo"
            class="h-8 w-8 rounded object-contain"
          />
          <span class="text-xs leading-tight text-slate-900">Fontibón<br />Reservado</span>
        </RouterLink>
      </template>

      <template #actions>
        <DuiButton size="sm" color="neutral" variant="outline" to="/profile">
          <i class="mdi mdi-account-circle-outline mr-1"></i>
          Mi perfil
        </DuiButton>
        <DuiButton size="sm" color="danger" variant="outline" @click="signOut">
          Cerrar sesion
        </DuiButton>
      </template>
    </DuiNavbar>
  </header>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DuiButton, DuiNavbar } from '@dronico/droni-kit'
import { computed } from 'vue'
import { getAuthUser, useAuth } from '../composables/useAuth'

const router = useRouter()
const { logout } = useAuth()
const isAdmin = computed(() => getAuthUser()?.role === 'admin')
const isBoard = computed(() => ['board', 'admin'].includes(getAuthUser()?.role ?? ''))
const isSecurity = computed(() => ['security', 'admin'].includes(getAuthUser()?.role ?? ''))

const navItems = computed(() => [
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
  ...(isBoard.value
    ? [
        {
          label: 'Consejo',
          icon: 'mdi mdi-account-tie-outline',
          to: '/board',
          children: [
            { label: 'Solicitudes de parqueo', to: '/board/parking-requests' },
            { label: 'Documentos', to: '/board/documents' },
          ],
        },
      ]
    : []),
  ...(isAdmin.value
    ? [
        {
          label: 'Administrar',
          icon: 'mdi mdi-shield-account-outline',
          to: '/admin',
          children: [
            { label: 'Unidades', to: '/admin/units' },
            { label: 'Usuarios', to: '/admin/users' },
            { label: 'Imports', to: '/admin/imports' },
            { label: 'Records', to: '/admin/records' },
          ],
        },
      ]
    : []),
  ...(isSecurity.value
    ? [
        {
          label: 'Seguridad',
          icon: 'mdi mdi-shield-lock-outline',
          to: '/security',
          children: [
            { label: 'Visitantes', to: '/security/visitors' },
            { label: 'Vehículos', to: '/security/vehicles' },
            { label: 'Paquetes', to: '/security/packages' },
          ],
        },
      ]
    : []),
])

function signOut() {
  logout()
  router.push('/auth/login')
}
</script>
