<template>
  <n-divider> 其他设置 </n-divider>
  <n-space justify="space-between">
    <span> layout 与 layout-header 背景反转</span>
    <n-switch
      :value="app.Layoutinverted"
      @update-value="val => app.$patch({ Layoutinverted: val })"
    ></n-switch>
  </n-space>
</template>

<script setup lang="ts">
import { appStore } from '@/store'
const app = appStore()
</script>

<style scoped></style>
