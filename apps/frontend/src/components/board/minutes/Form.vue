<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <DuiLabel title="Nombre" required>
      <DuiInput v-model="form.name" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Descripcion">
      <DuiInput v-model="form.description" size="lg" block />
    </DuiLabel>

    <DuiLabel title="Documento" help-text="Enlace al documento (PDF, foto, etc.).">
      <AttachmentUrlInput v-model="form.document" placeholder="https://..." />
    </DuiLabel>

    <WysiwygEditor v-model="form.content" />

    <DuiSwitch v-model="form.active" label="Activa" description="Las minutas activas quedan destacadas" />

    <DuiAlert v-if="errorMessage" color="danger" variant="outline">
      {{ errorMessage }}
    </DuiAlert>

    <div class="flex justify-end gap-2 pt-2">
      <DuiButton type="button" variant="outline" color="neutral" :disabled="loading" @click="emit('cancel')">
        Cancelar
      </DuiButton>
      <DuiButton type="submit" color="primary" :loading="loading">
        {{ mode === 'create' ? 'Crear minuta' : 'Guardar cambios' }}
      </DuiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { DuiAlert, DuiButton, DuiInput, DuiLabel, DuiSwitch } from '@dronico/droni-kit'
import type { Minute } from '../../../types/minutes'
import WysiwygEditor from '../../WysiwygEditor.vue'
import AttachmentUrlInput from '../../AttachmentUrlInput.vue'

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    minute?: Minute | null
    loading?: boolean
    errorMessage?: string
  }>(),
  {
    mode: 'create',
    minute: null,
    loading: false,
    errorMessage: '',
  }
)

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>]
  cancel: []
}>()

const form = reactive({
  name: '',
  description: '',
  document: '',
  content: '',
  active: false,
})

watch(
  () => props.minute,
  (minute) => {
    form.name = minute?.name ?? ''
    form.description = minute?.description ?? ''
    form.document = minute?.document ?? ''
    form.content = minute?.content ?? ''
    form.active = minute?.active ?? false
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim() || null,
    document: form.document.trim() || null,
    content: form.content.trim() || null,
    active: form.active,
  })
}
</script>
