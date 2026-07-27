<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Noticias y eventos</h1>
        <p class="text-sm text-gray-500">Lo que está pasando en el conjunto residencial.</p>
      </div>
      <DuiButton variant="outline" color="neutral" to="/social">
        <i class="mdi mdi-arrow-left mr-1"></i>
        Social
      </DuiButton>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <DuiCard v-for="post in news" :key="post.title" :image="post.image">
          <div class="flex items-center gap-2">
            <DuiBadge size="sm" color="primary" variant="soft">{{ post.category }}</DuiBadge>
            <span class="text-xs text-gray-400">{{ post.date }}</span>
          </div>
          <p class="mt-2 text-lg font-medium text-slate-900">{{ post.title }}</p>
          <p class="text-sm text-gray-500">{{ post.excerpt }}</p>
          <div class="mt-3 flex items-center gap-4 text-sm text-gray-400">
            <span><i class="mdi mdi-heart-outline mr-1"></i>{{ post.likes }}</span>
            <span><i class="mdi mdi-comment-outline mr-1"></i>{{ post.comments }}</span>
            <span class="ml-auto">{{ post.author }}</span>
          </div>
        </DuiCard>
      </div>

      <DuiCard title="Próximos eventos">
        <ul class="space-y-4">
          <li v-for="event in events" :key="event.title" class="flex items-start gap-3">
            <div class="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <span class="text-xs font-medium leading-none">{{ event.month }}</span>
              <span class="text-lg font-semibold leading-none">{{ event.day }}</span>
            </div>
            <div class="min-w-0">
              <p class="font-medium text-slate-900">{{ event.title }}</p>
              <p class="text-sm text-gray-500">{{ event.time }} - {{ event.location }}</p>
            </div>
          </li>
        </ul>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DuiBadge, DuiButton, DuiCard } from '@dronico/droni-kit'

const news = [
  {
    image: 'https://loremflickr.com/640/360/movie-projector?lock=105',
    category: 'Evento',
    date: '24 jul 2026',
    title: 'Cine al aire libre en la zona BBQ',
    excerpt: 'Este viernes disfruta de una noche de cine bajo las estrellas junto a tus vecinos. Entrada libre, trae tu manta.',
    likes: 34,
    comments: 8,
    author: 'María Fernanda López',
  },
  {
    image: 'https://loremflickr.com/640/360/market,fair?lock=102',
    category: 'Comunidad',
    date: '20 jul 2026',
    title: 'Feria de emprendedores del conjunto',
    excerpt: 'Vecinos emprendedores mostrarán sus productos y servicios en el salón comunal. ¡Apoya el talento local!',
    likes: 51,
    comments: 12,
    author: 'Comité de convivencia',
  },
  {
    image: 'https://loremflickr.com/640/360/garden,landscaping?lock=103',
    category: 'Noticia',
    date: '14 jul 2026',
    title: 'Renovación de zonas verdes y jardines',
    excerpt: 'Se completó la renovación paisajística de las zonas verdes de la torre 2, con nuevas especies nativas.',
    likes: 27,
    comments: 4,
    author: 'Administración',
  },
]

const events = [
  { month: 'AGO', day: '02', title: 'Cine al aire libre', time: '7:00 p.m.', location: 'Zona BBQ' },
  { month: 'AGO', day: '09', title: 'Feria de emprendedores', time: '10:00 a.m.', location: 'Salón comunal' },
  { month: 'AGO', day: '15', title: 'Asamblea ordinaria anual', time: '6:00 p.m.', location: 'Salón comunal' },
  { month: 'AGO', day: '23', title: 'Torneo de fútbol vecinal', time: '3:00 p.m.', location: 'Cancha múltiple' },
]
</script>
