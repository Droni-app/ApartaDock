<template>
  <div v-if="props.modelValue" class="flex flex-col gap-3">
    <DuiLabel title="Nombre del documento" required>
      <DuiInput v-model="props.modelValue.name" label="Nombre del documento" placeholder="Ingresa el nombre del documento" />
    </DuiLabel>
    <DuiLabel title="Categoría" required help-text="Elige la categoría mas acertada para el documento">
      <DuiSelect v-model="props.modelValue.category"
        label="Categoría"
        placeholder="Selecciona una categoría"
        item-label="value"
        :options="[
          { value: 'Reglamentos'},
          { value: 'Comunicaciones'},
          { value: 'Actas'},
          { value: 'Estados financieros'},
          { value: 'Formatos'},
          { value: 'Otros'},
        ]"
      />
    </DuiLabel>
    <DuiLabel title="Imagen asociada" help-text="Enlace a una foto o PDF de la tarjeta de propiedad.">
      <AttachmentUrlInput v-model="props.modelValue.picture" accept="image/*" />
    </DuiLabel>
    <DuiLabel title="Documento" required help-text="Enlace al documento (PDF, foto, etc.).">
      <AttachmentUrlInput v-model="props.modelValue.document" accept="image/*,application/pdf" />
    </DuiLabel>
    <WysiwygEditor v-model="props.modelValue.content" />
    <DuiSwitch v-model="props.modelValue.active" label="Activa" description="Las minutas activas son de acceso público" />
  </div>
</template>
<script setup lang="ts">
import { DuiInput, DuiLabel, DuiSelect, DuiSwitch } from '@dronico/droni-kit'
import type { Document } from '../../../types/document'
import AttachmentUrlInput from '../../AttachmentUrlInput.vue'
import WysiwygEditor from '../../WysiwygEditor.vue'

const props = withDefaults(
  defineProps<{
    modelValue: Document
  }>(),
  {}
)

</script>
