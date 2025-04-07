<script setup lang="ts">
const audioPlayerRef = ref<HTMLAudioElement | null>(null)
let chunks = []
let streamEnded = false
const init = async () => {
  try {
    // 使用 fetch 请求数据流
    const response = await fetch('http://192.168.2.28:7379/stream', {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream', // 确保请求头正确
      },
    })
    const mediaSource = new MediaSource()
    // 使用 URL.createObjectURL 生成对象 URL 并赋值给 audio 元素的 src 属性
    const url = URL.createObjectURL(mediaSource)
    audioPlayerRef.value.src = url

    // 确保响应是流式数据
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 创建一个可读流
    const reader = response.body.getReader()

    // 初始化音频播放器
    const contentType = response.headers.get('content-type')

    // 等待 MediaSource 准备好
    mediaSource.onsourceopen = () => {
      const sourceBuffer = mediaSource.addSourceBuffer(contentType)

      const processChunk = async () => {
        const { done, value } = await reader.read()
        if (done) {
          //   sourceBuffer.markEndOfStream()
          return
        }
        // 等待 SourceBuffer 空闲
        await new Promise(resolve => {
          if (!sourceBuffer.updating) {
            resolve()
          } else {
            const onUpdateEnd = () => {
              sourceBuffer.removeEventListener('updateend', onUpdateEnd)
              resolve()
            }
            sourceBuffer.addEventListener('updateend', onUpdateEnd)
          }
        })
        sourceBuffer.appendBuffer(value)
        processChunk()
      }
      processChunk()
    }
  } catch (error) {
    console.error('Error fetching audio stream:', error)
  }
}
</script>

<template>
  <div class="demo-content-view">
    <audio
      ref="audioPlayerRef"
      controls
      autoplay="true"
    ></audio>

    <n-button @click="init">开始播放</n-button>
  </div>
</template>

<style lang="scss" scoped></style>
