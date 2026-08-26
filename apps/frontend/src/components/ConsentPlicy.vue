<template>
  <div v-if="isConsentExpired()" class="container mx-auto p-4">
    <DuiAlert color="warning" rounded="all" variant="ghost">
      <p>
        Hay cambios en nuestra <strong>política de privacidad, términos y condiciones</strong>, es necesario que realice una validación y acepte los nuevos términos para continuar utilizando nuestros servicios.
      </p>
      <DuiButton size="sm" color="warning" variant="outline" class="mt-2">
        <i class="mdi mdi-file-document-outline"></i>
        Actualizar datos y aceptar términos
      </DuiButton>
    </DuiAlert>
  </div>
</template>
<script setup lang="ts">
import { DuiAlert, DuiButton } from '@dronico/droni-kit';
import { getAuthUser } from '../composables/useAuth'
import config from '../services/config'
const user = getAuthUser()

// is current Date greater than lastConsentDate
function isConsentExpired() {
  const lastConsentDate = new Date(config.lastConsentDate)
  const userLastConsentDate = new Date(user!.updatedAt)
  return userLastConsentDate < lastConsentDate
}

</script>

