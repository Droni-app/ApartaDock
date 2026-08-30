<template>
  <div>
    <UiTitlePage
      title="Actualización de datos"
      description="Ayudanos a mantener actualizada la ifnromación de la copropiedad."
    />
    <div class="md:grid grid-cols-2 gap-4 justify-items-stretch my-4">
      <DuiCard>
        <p class="mb-3">
          Para comenzar a disfrutar de todas las funcionalidades de la plataforma, es necesario que completes este paso inicial. Por favor, lee detenidamente nuestros Términos y Condiciones, y asegúrate de actualizar y verificar tu información personal en el formulario.
        </p>
        <p>
          Mantener tus datos exactos y al día es fundamental para nuestra comunidad, ya que nos permite:
        </p>
        <ul class="my-4 text-sm list-disc pl-6 space-y-1">
          <li>Garantizar una comunicación oportuna sobre asambleas, mantenimientos y circulares.</li>
          <li>Actuar de manera rápida y eficiente en caso de cualquier emergencia en tu unidad.</li>
          <li>Mantener altos estándares de seguridad en el control de acceso a la copropiedad.</li>
        </ul>
        <DuiAlert variant="outline" color="warning">
          <h4 class="text-xl mb-3">
            Actualización por única vez
          </h4>
          <p class="text-sm mb-3">Por motivos de seguridad y control de la información, la actualización de tus datos a través de esta plataforma virtual solo se puede realizar una única vez durante este primer ingreso.</p>

          <p class="text-sm">Por favor, revisa cuidadosamente que toda la información ingresada sea correcta antes de guardar. Una vez confirmados, los datos no podrán ser modificados virtualmente. Si en el futuro requieres hacer algún cambio o actualización adicional, deberás acercarte de manera presencial a la oficina de administración.</p>
        </DuiAlert>
      </DuiCard>
      <DuiCard>
        <form class="space-y-4" autocomplete="off" @submit.prevent="upData">
          <DuiLabel class="block mb-3" title="Nombre completo" required>
            <DuiInput v-model="userData.fullName" required />
          </DuiLabel>
          <DuiLabel class="block mb-3" title="Tipo de documento" required>
            <DuiSelect v-model="userData.documentType" :options="documentTypeOptions" />
          </DuiLabel>
          <DuiLabel class="block mb-3" title="Número de documento" required>
            <DuiInput v-model="userData.document" required />
          </DuiLabel>
          <DuiLabel class="block mb-3" title="Teléfono (Whatsapp)" required>
            <DuiInput v-model="userData.phone" required />
          </DuiLabel>
          <DuiLabel class="block mb-3" title="Términos y condiciones" required>
            <DuiCheckbox  label="Acepto la política de tratamiento de datos, términos y condiciones" required />
            <a href="/legal/policy.html" target="_blank" class="block text-sm text-pink-600 hover:underline">
              <i class="mdi mdi-open-in-new" />
              Política de privacidad y términos de uso
            </a>
          </DuiLabel>
          <DuiButton type="submit">
            <i class="mdi mdi-content-save-check-outline" />
            Actualizar mis datos
          </DuiButton>
        </form>
      </DuiCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DuiButton, DuiCard, DuiInput, DuiLabel, DuiCheckbox, DuiSelect, useToast, DuiAlert } from '@dronico/droni-kit'
import UiTitlePage from '../../components/Ui/TitlePage.vue'
import { api } from '../../services/api'
import { getAuthUser, useAuth} from '../../composables/useAuth'
import config from '../../services/config'
const user = getAuthUser()
const auth = useAuth()
const toast = useToast()
const router = useRouter()
const userData = ref(user!)
const documentTypeOptions = [
  { value: 'CC', label: 'Cedula de ciudadania' },
  { value: 'CE', label: 'Cedula de extranjeria' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'PP', label: 'Pasaporte' },
]
onMounted(()=> {
  if(!user?.consentDate) return true
  const lastConsentDate = new Date(config.lastConsentDate)
  const userLastConsentDate = new Date(user.updatedAt)
  if(userLastConsentDate > lastConsentDate) {
    toast.warning('Ya haz actualizado datos.')
    router.push('/')
  }
})

function upData() {
  api.put('/account/profile/updata', userData.value)
    .then(()=> {
      toast.success('Tus datos han sido actualizados correctamente')
      auth.me()
      router.push('/')
    }).catch(e=>{
      toast.error(e?.response?.data?.message ?? 'No se pudo actualizar la información.')
    })
}
</script>