<template>
  <main class="bg-slate-100 dark:bg-slate-950 p-4 grid place-items-center">
    <section class="w-full max-w-md">
      <div class="mb-5 flex justify-center">
        <img src="/logo.webp" alt="Fontibon Reservado" class="h-20 w-20 rounded-xl object-contain shadow-sm" />
      </div>

      <DuiCard
        class="w-full"
        size="l"
        title="Crear un usuario">
        <p class="text-sm text-gray-500 dark:text-slate-400 mb-4">
          Regístrate para acceder a la informacion de tu unidad, una vez registrado podras iniciar sesion con Google o crear una nueva contraseña.
        </p>
        <form class="space-y-4" @submit.prevent="register" autocomplete="off">
          <DuiLabel class="block mb-3" title="Nombre completo" required>
            <DuiInput v-model="userRegister.fullName" size="lg" block placeholder="ej. Juan Perez" required />
          </DuiLabel>

          <DuiLabel class="block mb-3" title="Tipo de documento" required>
            <DuiSelect
              v-model="userRegister.documentType"
              :options="[
                { value: 'CC', label: 'Cédula de ciudadanía' },
                { value: 'CE', label: 'Cédula de extrangería' },
                { value: 'TI', label: 'Tarjeta de Identidad' },
                { value: 'PP', label: 'Pasaporte' },
              ]"
              size="lg"
              block />
          </DuiLabel>

          <DuiLabel class="block mb-3" title="Número de documento" required>
            <DuiInput v-model="userRegister.document" size="lg" block placeholder="1000000001" required />
          </DuiLabel>

          <DuiLabel
            class="block mb-3"
            help-text="Debe incluir el número de torre seguido del número de apartamento sin espacios"
            title="Número de unidad"
            required>
            <DuiInput v-model="userRegister.unitName" size="lg" block placeholder="ej. 12001" required />
          </DuiLabel>

          <DuiLabel class="block mb-3" title="Correo" required>
            <DuiInput v-model="userRegister.email" type="email" size="lg" block placeholder="ejemplo@dominio.com" required />
          </DuiLabel>

          <DuiLabel class="block mb-3" title="Confirmación de correo" required>
            <DuiInput v-model="userRegister.email_confirmation" type="email" size="lg" block placeholder="ejemplo@dominio.com" required />
          </DuiLabel>

          <DuiLabel class="block mb-3" title="Teléfono celular" required>
            <DuiInput v-model="userRegister.phone"size="lg" block placeholder="ej. 3001234567" required />
          </DuiLabel>

          <DuiLabel class="block mb-3" title="Confirmación de teléfono celular" required>
            <DuiInput v-model="userRegister.phone_confirmation" size="lg" block placeholder="ej. 3001234567" required />
          </DuiLabel>

          <p class="text-xs text-gray-500 dark:text-slate-400 mt-4">
            Al registrarse, estás aceptando nuestra <a href="/legal/policy.html" target="_blank" class="text-pink-500 hover:underline">política de privacidad y términos de uso</a>.
          </p>

          <DuiButton type="submit" :loading="loading" block size="lg">
            Registrar usuario
          </DuiButton>
        </form>
      </DuiCard>
    </section>
  </main>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { DuiButton, DuiCard, DuiInput, DuiLabel, DuiSelect, useToast } from '@dronico/droni-kit'
import { api } from '@/services/api'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const loading = ref(false)

const userRegister = reactive({
  fullName: '',
  documentType: 'CC',
  document: '',
  unitName: '',
  email: '',
  email_confirmation: '',
  phone: '',
  phone_confirmation: ''
})

async function register() {
  loading.value = true
  api.post('/auth/register', userRegister).then(res=>{
    console.log(res)
    toast.success('Registro creado satisfactoriamente, ahora puede')
    router.push('/auth/login')

  }).catch(e=>{
    console.log(e.response.data)
    if(Array.isArray(e.response.data.errors)) {
      e.response.data.errors.forEach((error:{ message: string })  => {
        toast.error(error.message)
      });
    }
    else {
      toast.error(e.response.data.message ?? 'Error al registrar usuario')
    }
  }).finally(()=>{
    loading.value = false
  })
}
</script>