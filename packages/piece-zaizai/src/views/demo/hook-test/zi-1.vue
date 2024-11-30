<template>
  <h1>子组件：</h1>
  <div class="flex-col-center">content.name {{ state.sum }}</div>
</template>

<script setup lang="ts">
import { content } from './index'
const { state } = content()
</script>

<style scoped></style>
