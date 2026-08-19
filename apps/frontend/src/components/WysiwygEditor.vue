<template>
  <div class="wysiwyg-wrapper" :class="{ 'is-dark': isDark }">
    <QuillEditor
      ref="quillRef"
      content-type="html"
      theme="snow"
      :content="content"
      :toolbar="toolbar"
      :formats="formats"
      @ready="handleReady"
      @update:content="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { useTheme } from '../composables/useTheme'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = withDefaults(defineProps<{ modelValue: string | null }>(), { modelValue: '' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { isDark } = useTheme()

const toolbar = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ header: [1, 2, 3, false] }],
  ['link'],
  ['clean'],
]

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'link']

const content = computed(() => props.modelValue ?? '')

function handleUpdate(value: string) {
  emit('update:modelValue', value)
}

function handleReady(quill: any) {
  quill.clipboard.addMatcher(Node.ELEMENT_NODE, (_node: Node, delta: any) => {
    if (!delta?.ops) {
      return delta
    }

    for (const op of delta.ops) {
      if (!op.attributes) {
        continue
      }

      delete op.attributes.color
      delete op.attributes.background
      delete op.attributes.font
      delete op.attributes.size
      delete op.attributes.align
      delete op.attributes.indent
      delete op.attributes.direction
      delete op.attributes.script
      delete op.attributes.code
      delete op.attributes.blockquote

      if (Object.keys(op.attributes).length === 0) {
        delete op.attributes
      }
    }

    return delta
  })
}
</script>

<style scoped>
:deep(.ql-toolbar.ql-snow) {
  border: 1px solid rgb(209 213 219);
  border-bottom: 0;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background: rgb(248 250 252);
}

:deep(.ql-container.ql-snow) {
  border: 1px solid rgb(209 213 219);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  min-height: 12rem;
  background: rgb(255 255 255);
}

:deep(.ql-editor) {
  min-height: 10rem;
  max-height: 24rem;
  overflow-y: auto;
  color: rgb(15 23 42);
}

.is-dark :deep(.ql-toolbar.ql-snow),
.is-dark :deep(.ql-container.ql-snow) {
  border-color: rgb(71 85 105);
}

.is-dark :deep(.ql-toolbar.ql-snow) {
  background: rgb(30 41 59 / 0.6);
}

.is-dark :deep(.ql-container.ql-snow) {
  background: rgb(15 23 42);
}

.is-dark :deep(.ql-editor) {
  color: rgb(241 245 249);
}

.is-dark :deep(.ql-editor.ql-blank::before) {
  color: rgb(148 163 184);
}

.is-dark :deep(.ql-stroke) {
  stroke: rgb(203 213 225);
}

.is-dark :deep(.ql-fill) {
  fill: rgb(203 213 225);
}

.is-dark :deep(.ql-picker-label),
.is-dark :deep(.ql-picker-item) {
  color: rgb(203 213 225);
}

.is-dark :deep(.ql-snow .ql-picker-options) {
  background: rgb(15 23 42);
  border-color: rgb(71 85 105);
}

.is-dark :deep(.ql-snow.ql-toolbar button:hover),
.is-dark :deep(.ql-snow .ql-toolbar button:hover),
.is-dark :deep(.ql-snow.ql-toolbar button.ql-active),
.is-dark :deep(.ql-snow .ql-toolbar button.ql-active) {
  background: rgb(51 65 85);
}

.is-dark :deep(.ql-tooltip) {
  background: rgb(15 23 42);
  color: rgb(241 245 249);
  border-color: rgb(71 85 105);
  box-shadow: none;
}

.is-dark :deep(.ql-tooltip input[type='text']) {
  background: rgb(30 41 59);
  color: rgb(241 245 249);
  border-color: rgb(71 85 105);
}
</style>
