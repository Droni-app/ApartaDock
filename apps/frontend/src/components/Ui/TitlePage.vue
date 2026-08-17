<template>
  <div class="flex w-full">
    <div class="flex-1">
      <h1 class="text-2xl">
        {{ title }}
      </h1>
      <small>{{ description }}</small>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>