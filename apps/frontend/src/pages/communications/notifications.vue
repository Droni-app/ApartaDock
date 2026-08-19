<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Notificaciones</h1>
        <p class="text-sm text-gray-500 dark:text-slate-400">Alertas personales sobre tu unidad y el conjunto.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/communications">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Comunicaciones
      </DuiButton>
    </div>

    <DummyPageInfo />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <DuiCard class="lg:col-span-2" title="Recientes">
        <ul class="divide-y divide-gray-100">
          <li v-for="item in notifications" :key="item.title" class="flex items-start gap-3 py-4">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" :class="typeStyles[item.type].bg">
              <i :class="`mdi ${typeStyles[item.type].icon}`" :style="{ color: typeStyles[item.type].color }"></i>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-slate-900 dark:text-slate-100">{{ item.title }}</p>
              <p class="text-sm text-gray-500 dark:text-slate-400">{{ item.description }}</p>
              <p class="mt-1 text-xs text-gray-400 dark:text-slate-500">{{ item.date }}</p>
            </div>
            <span v-if="!item.read" class="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
          </li>
        </ul>
      </DuiCard>

      <DuiCard title="Preferencias de notificación" subtitle="Elige cómo quieres recibir tus alertas">
        <div class="space-y-4">
          <DuiSwitch v-model="preferences.email" label="Correo electrónico" description="Resumen diario y alertas importantes" />
          <DuiSwitch v-model="preferences.push" label="Notificaciones push" description="Avisos en tiempo real en la app" />
          <DuiSwitch v-model="preferences.sms" label="SMS" description="Solo alertas críticas de seguridad" />
          <DuiSwitch v-model="preferences.whatsapp" label="WhatsApp" description="Recordatorios de pagos y reservas" />
        </div>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { DuiButton, DuiCard, DuiSwitch } from '@dronico/droni-kit'
import DummyPageInfo from '../../components/DummyPageInfo.vue'

type NotificationType = 'payment' | 'package' | 'maintenance' | 'security' | 'general'

const typeStyles: Record<NotificationType, { icon: string; bg: string; color: string }> = {
  payment: { icon: 'mdi-currency-usd', bg: 'bg-red-50', color: '#d03b3b' },
  package: { icon: 'mdi-package-variant-closed', bg: 'bg-blue-50', color: '#2a78d6' },
  maintenance: { icon: 'mdi-wrench-outline', bg: 'bg-amber-50', color: '#eda100' },
  security: { icon: 'mdi-shield-alert-outline', bg: 'bg-violet-50', color: '#4a3aa7' },
  general: { icon: 'mdi-information-outline', bg: 'bg-slate-100 dark:bg-slate-950', color: '#52514e' },
}

const notifications: Array<{
  title: string
  description: string
  date: string
  type: NotificationType
  read: boolean
}> = [
  {
    title: 'Tienes un paquete en portería',
    description: 'Un paquete llegó a tu nombre y está disponible para reclamar en portería.',
    date: 'Hoy, 9:40 a.m.',
    type: 'package',
    read: false,
  },
  {
    title: 'Cuota de administración próxima a vencer',
    description: 'Tu cuota de julio vence en 5 días. Evita intereses de mora pagando a tiempo.',
    date: 'Ayer, 6:00 p.m.',
    type: 'payment',
    read: false,
  },
  {
    title: 'Mantenimiento de ascensor torre 2',
    description: 'El ascensor de la torre 2 estará fuera de servicio el 28 de julio de 8:00 a.m. a 12:00 m.',
    date: '23 jul, 3:15 p.m.',
    type: 'maintenance',
    read: true,
  },
  {
    title: 'Acceso peatonal registrado',
    description: 'Se registró el ingreso de un visitante autorizado a tu unidad.',
    date: '22 jul, 7:05 p.m.',
    type: 'security',
    read: true,
  },
  {
    title: 'Nueva encuesta disponible',
    description: 'Participa en la encuesta sobre el nuevo reglamento de mascotas.',
    date: '20 jul, 10:00 a.m.',
    type: 'general',
    read: true,
  },
]

const preferences = reactive({
  email: true,
  push: true,
  sms: false,
  whatsapp: true,
})
</script>
