<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Comunicaciones</h1>
        <p class="text-sm text-gray-500">
          Todo lo que la administración comparte con la comunidad, en un solo lugar.
        </p>
      </div>
      <DuiBadge color="success" variant="soft" size="lg">
        <i class="mdi mdi-check-decagram-outline mr-1"></i>
        Al día con tus comunicados
      </DuiBadge>
    </div>

    <DummyPageInfo />

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-bullhorn-outline" label="Comunicados este mes" value="12" hint="+3 vs. mes anterior" color="primary" />
      <StatTile icon="mdi-email-open-outline" label="Tasa de lectura" value="86%" hint="Promedio del conjunto" color="success" />
      <StatTile icon="mdi-file-document-multiple-outline" label="Documentos disponibles" value="47" hint="Reglamentos, actas y más" color="secondary" />
      <StatTile icon="mdi-bell-badge-outline" label="Notificaciones sin leer" value="3" hint="Requieren tu atención" color="warning" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <DuiCard
        v-for="link in quickLinks"
        :key="link.to"
        :to="link.to"
        class="transition-shadow hover:shadow-md"
      >
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <i :class="`mdi ${link.icon} text-xl`"></i>
          </div>
          <div>
            <p class="font-medium text-slate-900">{{ link.title }}</p>
            <p class="text-sm text-gray-500">{{ link.description }}</p>
          </div>
        </div>
      </DuiCard>
    </div>

    <DuiCard title="Últimos comunicados" subtitle="Publicados por la administración">
      <ul class="divide-y divide-gray-100">
        <li v-for="item in recentAnnouncements" :key="item.title" class="flex items-start gap-3 py-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <i :class="`mdi ${item.icon}`"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-medium text-slate-900">{{ item.title }}</p>
              <DuiBadge size="sm" :color="item.badgeColor" variant="soft">{{ item.category }}</DuiBadge>
            </div>
            <p class="truncate text-sm text-gray-500">{{ item.excerpt }}</p>
          </div>
          <span class="shrink-0 text-xs text-gray-400">{{ item.date }}</span>
        </li>
      </ul>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { DuiBadge, DuiCard } from '@dronico/droni-kit'
import StatTile from '../../components/StatTile.vue'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

const quickLinks = [
  {
    to: '/communications/administration',
    icon: 'mdi-bullhorn-outline',
    title: 'Administración',
    description: 'Comunicados, circulares y actas oficiales.',
  },
  {
    to: '/communications/documents',
    icon: 'mdi-file-document-multiple-outline',
    title: 'Documentos',
    description: 'Reglamentos, formatos y estados financieros.',
  },
  {
    to: '/communications/notifications',
    icon: 'mdi-bell-outline',
    title: 'Notificaciones',
    description: 'Alertas personales y preferencias de aviso.',
  },
]

const recentAnnouncements = [
  {
    icon: 'mdi-water-alert-outline',
    title: 'Corte programado de agua - Torre 3',
    category: 'Mantenimiento',
    badgeColor: 'warning' as const,
    excerpt: 'El sábado 26 de julio se suspenderá el servicio de 8:00 a.m. a 12:00 m. para labores de mantenimiento.',
    date: '25 jul',
  },
  {
    icon: 'mdi-file-certificate-outline',
    title: 'Acta de asamblea ordinaria 2026 disponible',
    category: 'Actas',
    badgeColor: 'primary' as const,
    excerpt: 'Ya puedes consultar el acta y los acuerdos de la asamblea realizada el 12 de julio.',
    date: '20 jul',
  },
  {
    icon: 'mdi-currency-usd',
    title: 'Recordatorio: vencimiento cuota de administración',
    category: 'Cartera',
    badgeColor: 'danger' as const,
    excerpt: 'El pago de la cuota de administración de julio vence el próximo 5 de agosto.',
    date: '18 jul',
  },
]
</script>
