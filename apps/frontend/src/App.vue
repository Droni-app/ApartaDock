<template>
  <main class="bg-slate-100 min-h-screen">
    <MainHeader v-if="isAuthenticated" />
    <RouterView class="my-3 container mx-auto" />
  </main>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import MainHeader from './components/MainHeader.vue'
import { useAuth } from './composables/useAuth'

const { user } = useAuth()

const isAuthenticated = computed(() => Boolean(user.value))
</script>
