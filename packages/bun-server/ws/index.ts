import type { WebSocketHandler } from 'bun'
import { wsMap, logger } from './const'
import { getMessage } from './message'
import dayjs from 'dayjs'
import './router'

const webSocketHandler: WebSocketHandler<{ socketId: string }> = {
  open(ws) {
    const socketId = ws.data.socketId
    if (!socketId) {
      return ws.close(401, 'Invalid socket id')
    }
    if (!wsMap.has(socketId)) {
      wsMap.set(socketId, {
        ws,
        messages: [],
        createDate: Date.now(),
      })
      logger.log(`有链接进来 ${socketId} ---date: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
    }
  },
  async message(ws, message) {
    if (message instanceof Buffer) {
      message = message.toString()
    }
    const messageRes = await getMessage(ws, message)
    console.log("🚀 ~ message ~ messageRes:", messageRes)
    if (messageRes) {
      if (typeof messageRes === 'string') {
        ws.send(messageRes)
      } else {
        ws.send(JSON.stringify(messageRes))
      }
    } else {
      ws.send('404 router not found')
    }
  },
  ping() {},
  pong() {},
  close(ws) {
    const socketId = ws.data.socketId
    if (wsMap.has(socketId)) {
      wsMap.delete(socketId)
    }
    logger.log(`有链接断开 ${socketId ? socketId : '无 socketId'} ---date: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
  },
}

export default webSocketHandler
