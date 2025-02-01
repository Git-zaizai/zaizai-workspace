import type { WebSocketHandler } from 'bun'
import { wsMap, logger } from './const'
import { getMessage } from './message'
import dayjs from 'dayjs'
import './router'

const webSocketHandler: WebSocketHandler = {
  open(ws) {
    let socketId = ws.data as string
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
    if (messageRes.length === 0) {
      ws.send('404 router not found')
    } else if (messageRes.length === 1 && typeof messageRes[0] === 'string') {
      ws.send(messageRes[0])
    } else {
      ws.send(JSON.stringify(messageRes))
    }
  },
  ping() {},
  pong() {},
  close(ws) {
    const socketId = ws.data as string
    if (wsMap.has(socketId)) {
      wsMap.delete(socketId)
    }
    logger.log(`有链接断开 ${socketId ? socketId : '无 socketId'} ---date: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
  },
}

export default webSocketHandler
