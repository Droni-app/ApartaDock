<template>
  <div>
    <div class="mb-4 flex gap-3">
      <DuiButton variant="outline" to="/admin/units">
        <i class="mdi mdi-office-building-outline mr-1"></i>
        Unidades
      </DuiButton>
      <DuiButton variant="outline" to="/admin/users">
        <i class="mdi mdi-account-group-outline mr-1"></i>
        Usuarios
      </DuiButton>
    </div>
    <DuiCard title="Administracion" subtitle="Estamos trabajando en este modulo.">
      Estamos trabajando en este modulo.
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { DuiButton, DuiCard } from '@dronico/droni-kit'
</script>
