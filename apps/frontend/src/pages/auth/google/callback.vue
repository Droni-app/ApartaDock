<template>
  <main class="flex flex-col items-center justify-center min-h-screen">
    <section class="w-full max-w-md p-6">
      <DuiCard class="w-full" size="l" title="Redireccionando..." subtitle="Estamos redireccionando a la página de inicio de sesión.">
        <div class="flex justify-center mt-4">
          Procesando la autenticación con Google. Por favor, espera un momento...
        </div>
      </DuiCard>
    </section>
  </main>
</template>
<script setup lang="ts">
import { DuiCard } from '@dronico/droni-kit'
import { useRoute } from 'vue-router'
import { useAuth } from '../../../composables/useAuth'

const code = useRoute().query.code as string

const { getUserFromCallback } = useAuth()


getUserFromCallback(code)

</script>