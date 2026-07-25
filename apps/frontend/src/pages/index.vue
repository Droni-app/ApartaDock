<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/units')
})
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-slate-100 text-slate-700">
    Redirigiendo...
  </div>
</template>
