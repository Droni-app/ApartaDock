<template>
  <header class="z-1 sticky top-0 bg-slate-100 dark:bg-slate-950 shadow-sm transition-colors dark:bg-slate-950">
    <DuiNavbar :items="navItems"
    underline-color="primary">
      <template #brand>
        <RouterLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/logo.webp"
            alt="ApartaDock logo"
            class="h-8 w-8 rounded object-contain"
          />
          <span class="text-xs leading-tight text-slate-900 dark:text-slate-100">Fontibón<br />Reservado</span>
        </RouterLink>
      </template>

      <template #actions>
        <DuiButton size="sm" color="neutral" variant="outline" @click="toggleTheme">
          <i :class="isDark ? 'mdi mdi-weather-sunny' : 'mdi mdi-weather-night'"></i>
        </DuiButton>
        <DuiButton size="sm" color="neutral" variant="outline" to="/profile">
          <i class="mdi mdi-account-circle-outline mr-1"></i>
          Perfil
        </DuiButton>
        <DuiButton size="sm" color="danger" variant="outline" @click="signOut">
          <i class="mdi mdi-logout"></i>
        </DuiButton>
      </template>
    </DuiNavbar>
    <ConsentPolicy />
  </header>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DuiButton, DuiNavbar } from '@dronico/droni-kit'
import { computed } from 'vue'
import { getAuthUser, useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'
import ConsentPolicy from './ConsentPolicy.vue'

const router = useRouter()
const { logout } = useAuth()
const { isDark, toggleTheme } = useTheme()
const isAdmin = computed(() => getAuthUser()?.role === 'admin')
const isBoard = computed(() => ['board', 'admin'].includes(getAuthUser()?.role ?? ''))
const isSecurity = computed(() => ['security', 'admin'].includes(getAuthUser()?.role ?? ''))

const navItems = computed(() => [
  {
    label: 'Gestión',
    icon: 'mdi mdi-office-building-cog-outline',
    to: '#',
    children: [
      { label: 'Unidades', to: '/management/units' },
      { label: 'Vehículos', to: '/management/vehicles' },
    ],
  },
  {
    label: 'Comunicaciones',
    icon: 'mdi mdi-message-text',
    to: '#',
    children: [
      { label: 'Documentos', to: '/communications/documents' },
    ],
  },
  ...(isBoard.value
    ? [
        {
          label: 'Consejo',
          icon: 'mdi mdi-account-tie-outline',
          to: '#',
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
          to: '#',
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
          to: '#',
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
