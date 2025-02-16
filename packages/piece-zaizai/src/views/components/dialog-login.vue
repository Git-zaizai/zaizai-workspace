<script setup lang="ts">
import Login from './login.vue'
import { useToggle } from '@vueuse/core'
const [showPopover, toggle] = useToggle()
const loginChange = e => {
    toggle(!e)
}
</script>

<template>
  <n-popover
    trigger="click"
    v-model:show="showPopover"
  >
    <template #trigger>
      <n-button
        quaternary
        size="small"
      >
        <Iconify class="i-ph-user" />
      </n-button>
    </template>
    <Login @change="loginChange" />
  </n-popover>
</template>

<style lang="scss" scoped></style>
