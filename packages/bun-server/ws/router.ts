import { use } from './message'
import { loggerAppend } from './const'

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
