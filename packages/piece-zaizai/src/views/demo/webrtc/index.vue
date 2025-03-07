<script setup lang="ts">
import mitt from 'mitt'

const emitter = mitt()
// A监听到socket里面的answer事件，需要将刚才的自己的RTCpeer添加远端描述
emitter.on('answer', async (data: RTCSessionDescriptionInit) => {
  await peer.setRemoteDescription(data)
})

// B发送过来的ICE候选信息
emitter.on('server-ICE-candidate', async (data: RTCIceCandidate) => {
  console.log("🚀 ~ emitter.on ~ data:", data)
  await peer.addIceCandidate(data)
})

let webSocket: WebSocket | null = null
function socketSend(route: string, data: any) {
  webSocket.send(
    JSON.stringify({
      route,
      data,
    })
  )
}

const peer = new RTCPeerConnection({
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
})

const peerMap = new Map()

const ICE_candidate = []

// 接下来A会获取到ICE候选信息，需要发送给B
peer.onicecandidate = (candidateInfo: RTCPeerConnectionIceEvent) => {
  console.log("🚀 ~ candidateInfo:", candidateInfo)
  if (candidateInfo.candidate) {
    // socketSend('ICE-candidate', candidateInfo.candidate)
    ICE_candidate.push(candidateInfo.candidate)
  }
}

// 监听 ICE gathering 状态变化
peer.addEventListener('icegatheringstatechange', () => {
  if (peer.iceGatheringState === 'complete') {
    console.log('ICE gathering complete')
    // 在这里可以执行所有候选者都被发现后的操作
    socketSend('ICE-candidate', ICE_candidate.at(-1))
  }
})

const localVideo = useTemplateRef('localVideoRef')
let stream: MediaStream | null = null

async function open() {
  try {
    // 创建数据源
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    // 显示数据源，localVideo 是 html 中的 video 标签
    localVideo.value.srcObject = stream
    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream)
    })
  } catch (error) {
    console.error('Error accessing media devices.', error)
  }
}

function close() {
  if (stream) {
    // 停止所有的轨道
    stream.getTracks().forEach(track => track.stop())
    // 清空视频源
    localVideo.value.srcObject = null
    stream = null
  }
}

async function createWebSocket() {
  webSocket = new WebSocket('ws://192.168.1.105:7379/server')

  webSocket.onopen = () => {
    console.log('打开 WebSocket')
    socketSend('server', 1)
  }

  webSocket.onerror = e => {
    console.log('打开WebSocket错误', e)
  }

  webSocket.onmessage = (message: any) => {
    if (message === '') {
      return
    }
    let data
    try {
      data = JSON.parse(message.data)
    } catch (error) {
      data = message.data
    }
    emitter.emit(data.code, data.data)
  }
}

async function sendPeer() {
  const offer = await peer.createOffer()
  await peer.setLocalDescription(offer)
  peerMap.set('offer', offer)
  socketSend('offer', offer)
}
function sendoffer() {
  socketSend('offer', peerMap.get('offer'))
}
function sendcandidate(){
  socketSend('ICE-candidate', peerMap.get('ICE-candidate'))
}
</script>

<template>
  <div class="demo-content-view flex-col">
    <n-button @click="open">创建数据源</n-button>
    <n-button
      @click="close"
      class="mt-5"
      >取消视频</n-button
    >
    <n-button
      @click="createWebSocket"
      class="mt-5"
      >创建webSocket</n-button
    >
    <n-button
      @click="sendPeer"
      class="mt-5"
      >创建 peer</n-button
    >
    <n-button
      @click="sendoffer"
      class="mt-5"
      >发送 offer</n-button
    >
    <n-button
      @click="sendcandidate"
      class="mt-5"
      >发送 ICE-candidate</n-button
    >
    <video
      ref="localVideoRef"
      width="500"
      height="500"
      autoplay
      playsinline
    ></video>
  </div>
</template>

<style lang="scss" scoped></style>
