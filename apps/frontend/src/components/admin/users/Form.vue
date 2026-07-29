<template>
  <form class="space-y-4" autocomplete="off" @submit.prevent="handleSubmit">
    <template v-if="mode === 'create'">
      <DuiLabel title="Nombre completo">
        <DuiInput v-model="form.fullName" size="lg" block autocomplete="off" />
      </DuiLabel>

      <DuiLabel title="Correo" required>
        <DuiInput v-model="form.email" type="email" size="lg" block autocomplete="off" />
      </DuiLabel>

      <div class="grid grid-cols-2 gap-3">
        <DuiLabel title="Tipo de documento" required>
          <DuiSelect v-model="form.documentType" :options="documentTypeOptions" size="lg" />
        </DuiLabel>
        <DuiLabel title="Documento">
          <DuiInput v-model="form.document" size="lg" block autocomplete="off" />
        </DuiLabel>
      </div>

      <DuiLabel title="Telefono">
        <DuiInput v-model="form.phone" size="lg" block autocomplete="off" />
      </DuiLabel>

      <DuiLabel title="Rol" required>
        <DuiSelect v-model="form.role" :options="roleOptions" size="lg" />
      </DuiLabel>

      <DuiLabel title="Contrasena" required help-text="Minimo 8 caracteres.">
        <DuiInput v-model="form.password" type="password" size="lg" block autocomplete="new-password" />
      </DuiLabel>
    </template>

    <template v-else>
      <div class="space-y-1 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        <p class="font-medium text-slate-900">{{ user?.fullName || user?.email }}</p>
        <p>{{ user?.email }}</p>
      </div>

      <DuiLabel title="Rol" required>
        <DuiSelect v-model="form.role" :options="roleOptions" size="lg" />
      </DuiLabel>

      <DuiLabel title="Nueva contrasena" help-text="Dejar en blanco para mantener la actual. Minimo 8 caracteres.">
        <DuiInput v-model="form.password" type="password" size="lg" block autocomplete="new-password" />
      </DuiLabel>
    </template>

    <DuiAlert v-if="errorMessage" color="danger" variant="outline">
      {{ errorMessage }}
    </DuiAlert>

    <div class="flex justify-end gap-2 pt-2">
      <DuiButton type="button" variant="outline" color="neutral" :disabled="loading" @click="emit('cancel')">
        Cancelar
      </DuiButton>
      <DuiButton type="submit" color="primary" :loading="loading">
        {{ mode === 'create' ? 'Crear usuario' : 'Guardar cambios' }}
      </DuiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { DuiAlert, DuiButton, DuiInput, DuiLabel, DuiSelect } from '@dronico/droni-kit'
import type { User } from '../../../types/users'

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    user?: User | null
    loading?: boolean
    errorMessage?: string
  }>(),
  {
    mode: 'create',
    user: null,
    loading: false,
    errorMessage: '',
  }
)

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>]
  cancel: []
}>()

const documentTypeOptions = [
  { value: 'CC', label: 'Cedula de ciudadania' },
  { value: 'CE', label: 'Cedula de extranjeria' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'PP', label: 'Pasaporte' },
]

const roleOptions = [
  { value: 'user', label: 'Usuario' },
  { value: 'admin', label: 'Administrador' },
  { value: 'board', label: 'Consejo' },
]

const form = reactive({
  fullName: '',
  email: '',
  documentType: 'CC',
  document: '',
  phone: '',
  role: 'user',
  password: '',
})

watch(
  () => props.user,
  (user) => {
    form.role = user?.role ?? 'user'
    form.password = ''
  },
  { immediate: true }
)

function handleSubmit() {
  if (props.mode === 'create') {
    emit('submit', {
      fullName: form.fullName.trim() || null,
      email: form.email.trim(),
      documentType: form.documentType,
      document: form.document.trim() || null,
      phone: form.phone.trim() || null,
      role: form.role,
      password: form.password,
    })
    return
  }

  const payload: Record<string, unknown> = { role: form.role }
  if (form.password) {
    payload.password = form.password
  }
  emit('submit', payload)
}
</script>
