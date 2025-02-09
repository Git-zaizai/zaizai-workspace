<script setup lang="ts">
let webSocket: WebSocket = null

const state = reactive({
  url: 'ws://localhost:7379?name=123',
  content: '',
  serverStr: [],
})

const errorStr = ref([])

const opws = () => {
  webSocket = new WebSocket(state.url)
  webSocket.onopen = () => {
    console.log('打开')
  }
  webSocket.onmessage = MessageEvent => {
    if (typeof MessageEvent.data === 'string') {
      state.serverStr.push(MessageEvent.data)
    }
  }
  webSocket.onerror = () => {
    errorStr.value.push('webscoket 断开')
  }
}

const bandSend = () => {
  if (webSocket) {
    webSocket.send(state.content)
  }
}

const bandclose = () => {
  if (!webSocket) {
    webSocket.close()
  }
}
const bandlog = () => {
  webSocket.send('log-json')
}
</script>

<template>
  <div class="console-content-view">
    <div class="mb-10">
      <h5>日志：</h5>
      <p v-for="item in errorStr">{{ item }}</p>
    </div>
    <n-input
      v-model:value="state.url"
      placeholder="链接url"
    ></n-input>
    <n-button @click="opws">打开WebSocket</n-button>
    <n-input
      v-model:value="state.content"
      placeholder="内容"
    ></n-input>
    <n-button @click="bandSend">发送内容</n-button>
    <div class="mb-10">
      <h5>服务端返回内容：</h5>
      <p v-for="item in state.serverStr">{{ item }}</p>
    </div>
    <n-button @click="bandclose">断开链接</n-button>
    <n-button @click="bandlog">logjson</n-button>
  </div>
</template>

<style lang="scss" scoped></style>
