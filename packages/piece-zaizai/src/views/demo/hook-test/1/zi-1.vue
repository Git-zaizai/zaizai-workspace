<template>
  <h1>子组件：</h1>
  <div class="flex-col-center">content.name {{ state.sum }}</div>
  <n-button
    type="success"
    @click="state.sum++"
  >点击
  </n-button
  >
</template>

<script
  setup
  lang="ts"
>
import { useStore } from './store'

const { state } = useStore()
</script>

<style scoped></style>
