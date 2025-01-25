<script setup lang="ts">
const ws = new WebSocket('ws://localhost:7379?name=123')
const str = ref('')
ws.onopen = () => {
  console.log('打开')
}

const asdasd = () => {
  ws.send('1')
}
</script>

<template>
  <div class="console-content-view">
    <n-input v-model:value="str" placeholder="输入内容"></n-input>
    <n-button @click="asdasd"></n-button>
  </div>
</template>

<style lang="scss" scoped></style>
