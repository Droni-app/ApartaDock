<template>
  <div class="space-y-6">
    <UiTitlePage
      title="Importar Registros"
      description="Herramienta de importación de registros de usuarios y unidades desde un archivo CSV."
    />
    <DuiCard title="Importar Usuarios">
      <p class="mb-4">
        Selecciona un archivo CSV que contenga los registros de usuarios y unidades que deseas importar. Asegúrate de que el archivo tenga el formato correcto. Puede usar el archivo de ejemplo <a href="/examples/ImportUsers.csv" class="text-blue-500 underline">ImportUsers.csv</a> para guiarte en la estructura del archivo.
      </p>
      <DuiInput type="file" @change="importUsers" />
    </DuiCard>
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios'
import { DuiCard, DuiInput, useToast } from '@dronico/droni-kit'
import { api } from '../../../services/api'
import UiTitlePage from '../../../components/Ui/TitlePage.vue'

const toast = useToast()

function importUsers(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const formData = new FormData()
    formData.append('file', file)

    api.post('/admin/imports/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('Import successful:', response.data)
        toast.add({
          color: 'success',
          message: 'Registros importados correctamente.'
        })
      })
      .catch((error: AxiosError) => {
        console.error('Import failed:', error)
        toast.add({
          color: 'danger',
          message: 'Error al importar usuarios. Revisa la consola para más detalles.'
        })
      })
  }
}

</script>
