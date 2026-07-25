<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DuiAction, DuiBadge, DuiCard } from '@dronico/droni-kit'

const route = useRoute()
const userId = computed(() => route.params.id)
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-4 sm:p-6">
    <div class="mx-auto w-full max-w-4xl">
      <DuiCard
        size="l"
        :title="`Vehiculos del usuario ${userId}`"
        subtitle="Ruta dinamica por sistema de pages"
      >
        <div class="space-y-3">
          <DuiBadge color="secondary" variant="outline">Ruta dinamica</DuiBadge>
          <p class="text-slate-700">
            Ruta tipo Nuxt generada por archivo:
            <strong>/pages/users/[id]/vehicles.vue</strong> -> <strong>/users/:id/vehicles</strong>
          </p>
        </div>

        <template #footer>
          <DuiAction to="/units" color="primary" variant="outline">
            Volver a unidades
          </DuiAction>
        </template>
      </DuiCard>
    </div>
  </main>
</template>
