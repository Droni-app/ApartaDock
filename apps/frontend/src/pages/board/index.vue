<template>
  <div>
    <div class="mb-4 flex gap-3">
      <DuiButton variant="outline" to="/board/parking-requests">
        <i class="mdi mdi-car-outline mr-1"></i>
        Solicitudes de parqueo
      </DuiButton>
    </div>

    <DummyPageInfo />

    <DuiCard title="Consejo de administracion" subtitle="Estamos trabajando en este modulo.">
      Estamos trabajando en este modulo.
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { DuiButton, DuiCard } from '@dronico/droni-kit'
import DummyPageInfo from '../../components/DummyPageInfo.vue'
</script>
