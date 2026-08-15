<template>
  <DuiLabel title="Document Name" required>
    <DuiInput v-model="props.modelValue.name" label="Document Name" placeholder="Enter document name" />
  </DuiLabel>
  <DuiLabel title="Category">
    <DuiSelect v-model="categoryValue"
      label="Category"
      placeholder="Select category"
      item-value="label"
      :options="[
        { label: 'Category1'},
        { label: 'Category2'},
        { label: 'Category3'}
      ]"
     />
  </DuiLabel>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { DuiInput, DuiLabel, DuiSelect } from '@dronico/droni-kit'
import type { Document } from '../../../types/document'

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    modelValue: Document
  }>(),
  {
    mode: 'create'
  }
)

const categoryValue = computed<string | number | undefined>({
  get: () => props.modelValue.category ?? undefined,
  set: (value) => {
    props.modelValue.category = value == null ? null : String(value)
  }
})
/*
import type { User } from './users'

export interface Document {
  id: number
  userId: number
  name: string
  category: string | null
  picture: string | null
  document: string | null
  content: string | null
  active: boolean | null
  createdAt: string | null
  updatedAt: string | null
  user?: User | null
}*/

</script>
