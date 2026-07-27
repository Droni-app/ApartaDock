<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900">Social</h1>
      <p class="text-sm text-gray-500">Conéctate con tus vecinos: noticias, eventos y clasificados.</p>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon="mdi-newspaper-variant-outline" label="Publicaciones esta semana" value="8" color="primary" />
      <StatTile icon="mdi-account-heart-outline" label="Vecinos activos" value="142" color="success" />
      <StatTile icon="mdi-calendar-star" label="Eventos próximos" value="3" color="secondary" />
      <StatTile icon="mdi-tag-outline" label="Clasificados activos" value="16" color="warning" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DuiCard to="/social/news-events" class="transition-shadow hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i class="mdi mdi-newspaper-variant-outline text-xl"></i>
            </div>
            <p class="mt-3 font-medium text-slate-900">Noticias y eventos</p>
            <p class="text-sm text-gray-500">Novedades del conjunto y actividades comunitarias.</p>
          </div>
          <i class="mdi mdi-chevron-right text-2xl text-gray-400"></i>
        </div>
      </DuiCard>

      <DuiCard to="/social/classifieds" class="transition-shadow hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i class="mdi mdi-tag-outline text-xl"></i>
            </div>
            <p class="mt-3 font-medium text-slate-900">Clasificados</p>
            <p class="text-sm text-gray-500">Compra, vende y ofrece servicios a tus vecinos.</p>
          </div>
          <i class="mdi mdi-chevron-right text-2xl text-gray-400"></i>
        </div>
      </DuiCard>
    </div>

    <DuiCard title="En la comunidad">
      <ul class="divide-y divide-gray-100">
        <li v-for="post in feed" :key="post.title" class="flex items-start gap-3 py-3">
          <img :src="post.avatar" :alt="post.author" class="h-9 w-9 shrink-0 rounded-full object-cover" />
          <div class="min-w-0 flex-1">
            <p class="text-sm text-slate-900">
              <span class="font-medium">{{ post.author }}</span> {{ post.action }}
            </p>
            <p class="truncate text-sm text-gray-500">{{ post.title }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ post.date }}</p>
          </div>
        </li>
      </ul>
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { DuiCard } from '@dronico/droni-kit'
import StatTile from '../../components/StatTile.vue'

const feed = [
  {
    avatar: 'https://i.pravatar.cc/64?img=32',
    author: 'María Fernanda López',
    action: 'publicó un evento:',
    title: 'Cine al aire libre en la zona BBQ',
    date: 'Hace 2 horas',
  },
  {
    avatar: 'https://i.pravatar.cc/64?img=12',
    author: 'Jorge Iván Suárez',
    action: 'publicó un clasificado:',
    title: 'Vendo bicicleta rodada 27.5',
    date: 'Hace 5 horas',
  },
  {
    avatar: 'https://i.pravatar.cc/64?img=47',
    author: 'Camila Torres',
    action: 'comentó en:',
    title: 'Feria de emprendedores del conjunto',
    date: 'Ayer',
  },
]
</script>
