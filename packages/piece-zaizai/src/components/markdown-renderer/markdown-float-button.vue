<template>
  <n-float-button
    :position="state.position"
    menu-trigger="hover"
    :right="20"
    :bottom="40"
    class="md-render-button"
  >
    <Iconify class="i-ph:markdown-logo" />

    <template #menu>
      <n-float-button @click="checkSourceCode">
        <Iconify class="i-ph:airplane-takeoff-bold" />
      </n-float-button>
      <n-float-button @click="checkCode">
        <Iconify class="i-ph:code-simple-bold" />
      </n-float-button>
    </template>
  </n-float-button>
</template>

<script setup lang="ts">
import type { FloatButtonProps } from 'naive-ui'

const props = defineProps<{
  bottom?: number
  top?: number
  right?: number
  left?: number
  position?: FloatButtonProps['position']
  openMdWay?: 'open' | 'render'
  checkSource?: boolean
  markdownUrl: string
}>()

const emits = defineEmits(['renderChange'])

const state = reactive({
  bottom: 0,
  right: 0,
  top: 0,
  left: 0,
  position: 'absolute',
  ...props,
})

const checkSourceCode = () => {
  if (props.checkSource) {
    return
  }
  const base = import.meta.env.VITE_GITHUB
  const fileURL = new URL(import.meta.url)
  window.open(base + '/blob/main' + fileURL.pathname)
}

const checkCode = () => {
  if (!props.openMdWay || props.openMdWay === 'open') {
    window.open(window.location.origin + `/markdown?markdownUrl=${props.markdownUrl}`)
  } else {
    window.$message.info('还没想好')
  }
}
</script>

<style scoped>
:global(.md-render-button) {
  background-color: transparent;
  z-index: 99;
}
:global(.md-render-button .n-float-button) {
  background-color: transparent;
}
</style>
