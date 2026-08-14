<template>
  <div class="space-y-2">
    <DuiButton
      v-if="props.attachment"
      variant="outline"
      color="primary"
      size="sm"
      class="w-full justify-start"
      @click="openFile(props.attachment)"
    >
      <i class="mdi mdi-attachment mr-1"></i>
      {{ props.attachment }}
    </DuiButton>
  </div>
</template>

<script setup lang="ts">
import { DuiButton } from '@dronico/droni-kit'
import { api } from '../services/api'

const props = withDefaults(
  defineProps<{
    attachment: string
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()


function openFile(path:string) {
  console.log('openFile called with path:', path)
  // if  path starts with http or https, open in new tab
  if (path.startsWith('http://') || path.startsWith('https://')) {
    window.open(path, '_blank')
  } else {
    // otherwise, prepend api base url
    api.post('/user/attachments/download', { path })
      .then((response) => {
        const url = response.data.url
        window.open(url, '_blank')
      })
      .catch((err) => {
        console.error('Error downloading file:', err)
      })
  }
}

</script>
