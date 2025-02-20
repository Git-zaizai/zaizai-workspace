import { use } from './message'
import { loggerAppend } from './const'
import { Router } from '../router'
const router = new Router()

const detectingSocketId = (ws, data, next) => {
  if (!ws.data.socketId) {
    return {
      msg: '请先获取身份 socketId',
    }
  }
  return next()
}

use('1', () => {
  return '连接成功'
})

import { wsMap } from './const'
import dayjs from 'dayjs'

use('log-json', detectingSocketId, (ws, data) => {
  let socketId = ws.data.socketId
  if (!wsMap.has(socketId)) {
    return {
      msg: 'socketId 不存在',
    }
  }

  const wsData = wsMap.get(socketId)
  const resp = {
    socketId,
    createDate: wsData.createDate,
    messages: wsData.messages,
  }
  return resp
})

use('wol-windows', detectingSocketId, (ws, data) => {
  return {
    type: 'wol-app',
    code: 'wol-windows',
    data: data,
  }
})

use('get-socketId', detectingSocketId, ws => {
  let socketId = ws.data.socketId
  return {
    type: 'wol-app',
    code: 'get-socketId',
    data: socketId,
  }
})

use('test-socket-message', (ws, data) => {
  return {
    type: 'wol-app',
    code: 'test-socket-message',
    data: '服务器收到，' + data,
  }
})

use('heartbeat', (ws, data) => {
  let socketId = ws.data.socketId
  loggerAppend(`${dayjs().format('YYYY-MM-DD-HH-mm-ss')} ${socketId} 心跳 : ${data} \n`)
  return ''
})

use('reply-message', (ws, data) => {
  const wsi = wsMap.get(ws.data.socketId)
  const newData = JSON.parse(data)
  const index = wsi.messages.findIndex(fv => fv.id === newData.id)
  wsi.messages[index].replymsg = newData.msg
})

router.post('/ws/test-msg', req => {
  const { socketId, msg } = req.form

  if (!msg) {
    return { code: 400, msg: '请填写消息' }
  }

  if (!wsMap.has(socketId)) {
    return { code: 404, msg: '连接找不到了 ws' }
  }

  const ws = wsMap.get(socketId)
  console.log('🚀 ~ ws:', ws)

  ws.ws.send(
    JSON.stringify({
      type: 'wol-app',
      code: 'reply-message',
      data: msg,
    })
  )

  ws.messages.push({
    id: msg,
    replymsg: null,
  })

  return 1
})

router.post('/ws/get-test-msg', req => {
  const { socketId, msg } = req.form
  if (!wsMap.has(socketId)) {
    return { code: 400, msg: '连接找不到了 ws' }
  }
  const ws = wsMap.get(socketId)
  const find = ws.messages.find(fv => fv.id === msg)
  if (find.replymsg) {
    return {
      code: 200,
      data: find.replymsg,
    }
  } else {
    return {
      code: 204,
    }
  }
})

export const wsRouter = router
