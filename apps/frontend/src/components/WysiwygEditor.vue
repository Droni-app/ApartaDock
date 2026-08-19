<template>
  <div class="rounded-lg border border-gray-300 dark:border-slate-600 focus-within:border-blue-400">
    <div class="flex flex-wrap items-center gap-0.5 border-b border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-1">
      <button
        v-for="action in actions"
        :key="action.command"
        type="button"
        tabindex="-1"
        class="flex h-8 w-8 items-center justify-center rounded text-gray-600 dark:text-slate-300 hover:bg-slate-200"
        :title="action.title"
        @mousedown.prevent="exec(action.command, action.value)"
      >
        <i :class="`mdi ${action.icon}`"></i>
      </button>
    </div>
    <div
      ref="editorRef"
      class="min-h-[10rem] max-h-96 overflow-y-auto p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
      contenteditable="true"
      @input="handleInput"
      @paste="handlePaste"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ modelValue: string | null }>(), { modelValue: '' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editorRef = ref<HTMLDivElement | null>(null)

// A completely empty contenteditable element (no child nodes at all) can fail
// to accept a caret position in some browsers, bouncing focus back to the
// previous focusable element (e.g. a toolbar button). Always give it a
// placeholder line break so it can always be focused and edited.
const EMPTY_CONTENT = '<p><br></p>'

function isEmptyContent(value: string) {
  return !value || value === EMPTY_CONTENT || value === '<br>'
}

const actions: Array<{ command: string; value?: string; icon: string; title: string }> = [
  { command: 'bold', icon: 'mdi-format-bold', title: 'Negrita' },
  { command: 'italic', icon: 'mdi-format-italic', title: 'Cursiva' },
  { command: 'underline', icon: 'mdi-format-underline', title: 'Subrayado' },
  { command: 'insertUnorderedList', icon: 'mdi-format-list-bulleted', title: 'Lista con viñetas' },
  { command: 'insertOrderedList', icon: 'mdi-format-list-numbered', title: 'Lista numerada' },
  { command: 'formatBlock', value: 'H3', icon: 'mdi-format-header-3', title: 'Titulo' },
  { command: 'formatBlock', value: 'P', icon: 'mdi-format-paragraph', title: 'Parrafo' },
  { command: 'removeFormat', icon: 'mdi-format-clear', title: 'Limpiar formato' },
]

function exec(command: string, value?: string) {
  editorRef.value?.focus()
  document.execCommand(command, false, value)
  handleInput()
}

function handleInput() {
  const html = editorRef.value?.innerHTML ?? ''
  emit('update:modelValue', isEmptyContent(html) ? '' : html)
}

function handlePaste(event: ClipboardEvent) {
  // Let the browser paste formatted content (bold, lists, etc.) as-is,
  // we only need to make sure we emit the resulting content afterwards.
  requestAnimationFrame(handleInput)
  void event
}

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue || EMPTY_CONTENT
  }
})

watch(
  () => props.modelValue,
  (value) => {
    const el = editorRef.value
    if (!el || document.activeElement === el) {
      return
    }
    const html = value || EMPTY_CONTENT
    if (el.innerHTML !== html) {
      el.innerHTML = html
    }
  }
)
</script>
