<script setup lang="ts">
const ws = new WebSocket('ws://localhost:7379')

ws.onopen = () => {
  console.log('打开')
}

const asdasd = () => {
  ws.send('1')
}
</script>

<template>
  <div class="console-content-view">
    <n-button @click="asdasd"></n-button>
  </div>
</template>

<style lang="scss" scoped></style>
