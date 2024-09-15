<template>
  <n-float-button
    :position="position"
    menu-trigger="hover"
    :right="right"
    :bottom="bottom"
    class="md-render-button"
  >
    <Iconify class="i-ph:markdown-logo" />

    <template #menu>
      <n-float-button @click="deownlodaCode">
        <Iconify class="i-ph:download-simple" />
      </n-float-button>
      <n-float-button @click="showMd">
        <Iconify class="i-ph:code-simple-bold" />
      </n-float-button>
    </template>
  </n-float-button>
</template>

<script setup lang="ts">
import type { FloatButtonProps } from 'naive-ui'

withDefaults(
  defineProps<{
    bottom?: number
    top?: number
    right?: number
    left?: number
    position?: FloatButtonProps['position']
  }>(),
  {
    bottom: 40,
    right: 16,
    position: 'fixed',
  }
)

const downloadURL = () => {
  const base = import.meta.env.VITE_GITHUB
  const fileURL = new URL(import.meta.url)
  return base + '/blob/main' + fileURL.pathname
}
const deownlodaCode = () => {
  window.open(downloadURL())
}
const showMd = () => {
  console.log('asd')
}
</script>

<style scoped>
:global(.md-render-button) {
  background-color: transparent;
}
:global(.md-render-button .n-float-button) {
  background-color: transparent;
}
</style>
