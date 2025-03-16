<script setup lang="ts">
import mitt from 'mitt'

let serverIp = '192.168.2.28'

const emitter = mitt()
// A监听到socket里面的answer事件，需要将刚才的自己的RTCpeer添加远端描述
emitter.on('receiver-answer', async (data: RTCSessionDescriptionInit) => {
  /* 步骤6：处理接收端应答 */
  // ✅ 检查当前状态是否为 have-local-offer
  if (pc.signalingState === 'have-local-offer') {
    await pc.setRemoteDescription(data)
  } else {
    console.warn('收到 Answer 但状态不匹配:', pc.signalingState)
  }
})

// B发送过来的ICE候选信息
emitter.on('receiver-candidate', async (data: RTCIceCandidate) => {
  /* 步骤8：处理接收端候选 */
  pc.addIceCandidate(new RTCIceCandidate(data))
})

/* 步骤1：推送端初始化 */
let ws: WebSocket | null = null
let pc: RTCPeerConnection = null
let localStream
const localVideo = useTemplateRef('localVideoRef')
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}
let iscandidate = false

async function createWebSocket() {
  ws = new WebSocket(`ws://${serverIp}:7379/server`)

  ws.onopen = () => {
    console.log('打开 WebSocket')
    socketSend('server', 1)
  }

  ws.onerror = e => {
    console.log('打开WebSocket错误', e)
  }

  ws.onmessage = (message: any) => {
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

/* 步骤2：初始化媒体设备 */
async function createLocalStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    localVideo.value.srcObject = localStream
  } catch (e) {
    console.error('获取媒体设备失败:', e)
  }
}

let sender_candidate
/* 步骤3：创建推送端连接 */
function createPeerConnection() {
  pc = new RTCPeerConnection(configuration)

  // 添加本地流
  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream)
  })

  // 处理 ICE 候选
  pc.onicecandidate = ({ candidate }) => {
    if (candidate && candidate.address === serverIp && !iscandidate) {
      ws.send(
        JSON.stringify({
          route: 'sender-candidate',
          data: candidate.toJSON(),
        })
      )
      sender_candidate = candidate.toJSON()
      iscandidate = true
    }
  }
}

function sendsender_candidate() {
  ws.send(
    JSON.stringify({
      route: 'sender-candidate',
      data: sender_candidate,
    })
  )
}

let offer
/* 步骤4：发起呼叫 */
async function startBroadcast() {
  // createPeerConnection()
  offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  ws.send(
    JSON.stringify({
      route: 'sender-offer',
      data: pc.localDescription,
    })
  )
}

function sendOffer() {
  ws.send(
    JSON.stringify({
      route: 'sender-offer',
      data: pc.localDescription,
    })
  )
}

function socketSend(route: string, data: any) {
  ws.send(
    JSON.stringify({
      route,
      data,
    })
  )
}

function closeLocalStream() {
  // 停止所有的轨道
  localStream.getTracks().forEach(track => track.stop())
  // 清空视频源
  localVideo.value.srcObject = null
  localStream = null
  ws.close()
  ws = null
  pc.close()
  pc = null
}
</script>

<template>
  <div class="demo-content-view flex-col">
    <p>步骤1：推送端初始化</p>
    <n-button
      @click="createWebSocket"
      class="mt-5"
      >1.1 创建websocket</n-button
    >
    <n-button
      class="mt-5"
      @click="createLocalStream"
      >步骤2：初始化媒体设备</n-button
    >

    <n-button
      @click="createPeerConnection"
      class="mt-5"
      >步骤3：创建推送端连接</n-button
    >

    <div class="flex-x-center gap-5">
      <n-button
        @click="startBroadcast"
        class="mt-5"
        >发起 Offer</n-button
      >
      <n-button
        @click="sendsender_candidate"
        class="mt-5"
        >发起 sender_candidate</n-button
      >
    </div>

    <n-button
      @click="closeLocalStream"
      class="mt-7"
      >关闭所有</n-button
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
