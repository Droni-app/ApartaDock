<template>
  <div v-if="errors.length">
    <p class="mb-2 text-sm font-medium text-slate-900">Filas con errores</p>
    <ul class="max-h-64 divide-y divide-gray-200 overflow-y-auto rounded-lg border border-gray-200">
      <li v-for="importError in errors" :key="importError.index" class="px-4 py-2 text-sm">
        <span class="font-medium text-slate-900">Fila {{ importError.index + 1 }} ({{ importError.row }}):</span>
        <span class="text-red-600"> {{ importError.message }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ImportError } from '../../../types/imports'

defineProps<{
  errors: ImportError[]
}>()
</script>
