<template>
  <div class="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" :class="iconClasses">
      <i :class="`mdi ${icon} text-2xl`"></i>
    </div>
    <div class="min-w-0">
      <p class="truncate text-sm text-gray-500 dark:text-slate-400">{{ label }}</p>
      <p class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ value }}</p>
      <p v-if="hint" class="truncate text-xs text-gray-400 dark:text-slate-500">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    icon: string
    label: string
    value: string | number
    hint?: string
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
  }>(),
  {
    hint: '',
    color: 'primary',
  }
)

const colorMap: Record<string, string> = {
  primary: 'bg-blue-50 text-blue-600',
  secondary: 'bg-violet-50 text-violet-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  neutral: 'bg-slate-100 dark:bg-slate-950 text-slate-600',
}

const iconClasses = computed(() => colorMap[props.color] ?? colorMap.primary)
</script>
