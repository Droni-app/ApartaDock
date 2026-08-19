<template>
  <Teleport to="body">
    <Transition name="drawer-backdrop">
      <div v-if="modelValue" class="fixed inset-0 z-40 bg-black/40" @click="close" />
    </Transition>
    <Transition name="drawer-panel">
      <aside
        v-if="modelValue"
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white dark:bg-slate-900 shadow-xl"
      >
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 px-6 py-4">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
          <button
            type="button"
            class="text-gray-400 dark:text-slate-500 transition-colors hover:text-gray-600 dark:text-slate-300"
            @click="close"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <slot />
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-panel-enter-active,
.drawer-panel-leave-active {
  transition: transform 0.25s ease;
}
.drawer-panel-enter-from,
.drawer-panel-leave-to {
  transform: translateX(100%);
}
</style>
