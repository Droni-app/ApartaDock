<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Clasificados</h1>
        <p class="text-sm text-gray-500">Compra, vende y ofrece servicios a tus vecinos.</p>
      </div>
      <div class="flex gap-2">
        <DuiButton variant="outline" color="neutral" to="/social">
          <i class="mdi mdi-arrow-left mr-1"></i>
          Social
        </DuiButton>
        <DuiButton color="primary">
          <i class="mdi mdi-plus mr-1"></i>
          Publicar clasificado
        </DuiButton>
      </div>
    </div>

    <DuiTabs v-model="activeCategory" :tabs="categoryTabs" />

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DuiCard v-for="ad in filteredAds" :key="ad.title" :image="ad.image">
        <div class="flex items-start justify-between gap-2">
          <p class="font-medium text-slate-900">{{ ad.title }}</p>
          <DuiBadge size="sm" color="success" variant="soft">{{ ad.price }}</DuiBadge>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ ad.description }}</p>
        <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
          <span><i class="mdi mdi-account-outline mr-1"></i>{{ ad.seller }}</span>
          <span>{{ ad.date }}</span>
        </div>
      </DuiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DuiBadge, DuiButton, DuiCard, DuiTabs } from '@dronico/droni-kit'

type Category = 'Venta' | 'Servicios' | 'Empleos' | 'Mascotas'

const categoryTabs = [
  { label: 'Todos', value: 'all' },
  { label: 'Venta', value: 'Venta' },
  { label: 'Servicios', value: 'Servicios' },
  { label: 'Empleos', value: 'Empleos' },
  { label: 'Mascotas', value: 'Mascotas' },
]

const activeCategory = ref('all')

const ads: Array<{
  title: string
  category: Category
  price: string
  description: string
  seller: string
  date: string
  image: string
}> = [
  {
    title: 'Vendo bicicleta rodada 27.5',
    category: 'Venta',
    price: '$650.000',
    description: 'Poco uso, incluye casco y candado. Torre 4, apto 202.',
    seller: 'Jorge Suárez',
    date: 'Hace 5 h',
    image: 'https://loremflickr.com/480/300/bicycle?lock=201',
  },
  {
    title: 'Clases de inglés para niños',
    category: 'Servicios',
    price: '$40.000/h',
    description: 'Profesora certificada, clases en el conjunto o virtuales.',
    seller: 'Camila Torres',
    date: 'Hace 1 día',
    image: 'https://loremflickr.com/480/300/books,classroom?lock=202',
  },
  {
    title: 'Se busca niñera medio tiempo',
    category: 'Empleos',
    price: '$25.000/h',
    description: 'Cuidado de dos niños en las tardes, de lunes a viernes.',
    seller: 'Andrea Ríos',
    date: 'Hace 2 días',
    image: 'https://loremflickr.com/480/300/children,playing?lock=203',
  },
  {
    title: 'Adopción de gatitos',
    category: 'Mascotas',
    price: 'Gratis',
    description: 'Camada de 3 gatitos de 2 meses, desparasitados y vacunados.',
    seller: 'María Fernanda López',
    date: 'Hace 3 días',
    image: 'https://loremflickr.com/480/300/kitten?lock=204',
  },
  {
    title: 'Comedor de 6 puestos en madera',
    category: 'Venta',
    price: '$1.200.000',
    description: 'Excelente estado, incluye sillas tapizadas.',
    seller: 'Carlos Pérez',
    date: 'Hace 4 días',
    image: 'https://loremflickr.com/480/300/dining-table,furniture?lock=205',
  },
  {
    title: 'Paseador y cuidador de mascotas',
    category: 'Servicios',
    price: '$20.000/paseo',
    description: 'Disponibilidad todos los días, referencias del conjunto.',
    seller: 'Luis Ramírez',
    date: 'Hace 5 días',
    image: 'https://loremflickr.com/480/300/dog,walking?lock=206',
  },
]

const filteredAds = computed(() =>
  activeCategory.value === 'all' ? ads : ads.filter((ad) => ad.category === activeCategory.value)
)
</script>
