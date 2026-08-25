<template>
  <main class="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 grid place-items-center">
    <section class="w-full max-w-md">
      <div class="mb-5 flex justify-center">
        <img src="/logo.webp" alt="Fontibon Reservado" class="h-20 w-20 rounded-xl object-contain shadow-sm" />
      </div>

      <DuiCard class="w-full" size="l" title="Cambiar contraseña" subtitle="Ingresa tu nueva contraseña para continuar.">
        <form class="space-y-4" @submit.prevent="updatePassword">
          <DuiLabel title="Correo" required>
            <DuiInput v-model="form.email" type="email" size="lg" block />
          </DuiLabel>

          <DuiLabel title="Nueva contraseña" required>
            <DuiInput v-model="form.newPassword" type="password" size="lg" block />
          </DuiLabel>

          <DuiLabel title="Confirmar nueva contraseña" required>
            <DuiInput v-model="form.newPassword_confirmation" type="password" size="lg" block />
          </DuiLabel>

          <DuiButton type="submit" :loading="loading" block size="lg" class="mt-4">
            Cambiar contraseña
          </DuiButton>
        </form>
      </DuiCard>
    </section>
  </main>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DuiButton, DuiCard, DuiInput, DuiLabel, useToast } from '@dronico/droni-kit'
import { api } from '../../../services/api'

const toast = useToast()
const loading = ref(false)
const form = reactive({
  email: '',
  newPassword: '',
  newPassword_confirmation: '',
})

const route = useRoute()
const router = useRouter()
const signature = route.query.signature as string
const id = route.query.id as string

function updatePassword() {
  loading.value = true
  api.post(`/auth/password/update/${id}?signature=${signature}`, form)
    .then(() => {
      toast.add({
        color: 'success',
        title: 'Éxito',
        message: 'Contraseña actualizada correctamente.',
      })
      // redirect to login page
      router.push('/auth/login')
    })
    .catch((error) => {
      console.error(error.response?.data)
      toast.add({
        color: 'danger',
        title: 'Error',
        message: 'Error al actualizar la contraseña.',
      })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>