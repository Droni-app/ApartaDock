<template>
  <DuiCard>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-500/10 text-xl font-semibold text-primary-600 ring-1 ring-primary-500/20 dark:text-primary-300">
          {{ initials }}
        </div>
        <div>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ timeGreeting }}</p>
          <h1 class="text-2xl text-slate-900 dark:text-slate-100">{{ name }}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ roleMeta.greeting }}</p>
        </div>
      </div>

      <DuiBadge :color="roleMeta.color" variant="soft" size="lg">
        <template #icon>
          <i :class="`mdi ${roleMeta.icon}`"></i>
        </template>
        {{ roleMeta.label }}
      </DuiBadge>
    </div>
  </DuiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DuiBadge, DuiCard } from '@dronico/droni-kit'
import type { AuthUser } from '../../types/auth'
import { getRoleMeta } from '../../utils/roles'

const props = defineProps<{ user: AuthUser }>()

const name = computed(() => props.user.fullName ?? props.user.email)

const initials = computed(() =>
  name.value
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(''),
)

const roleMeta = computed(() => getRoleMeta(props.user.role))

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
})
</script>
