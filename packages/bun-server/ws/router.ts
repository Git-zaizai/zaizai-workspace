// import { use } from './message'
import { loggerAppend } from './const'
import { Router } from '../plugins/router'
import WsRouter from './ws-router'

export const wsRouter = new WsRouter()
const router = new Router()

const detectingSocketId = (ws, data, next) => {
  if (!ws.data.socketId) {
    return {
      msg: '请先获取身份 socketId',
    }
  }
  return next()
}

wsRouter.use('1', () => '连接成功')

import { wsMap } from './const'
import dayjs from 'dayjs'

wsRouter.use('log-json', detectingSocketId, (data, ws) => {
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

wsRouter.use('wol-windows', detectingSocketId, (data, ws) => {
  return {
    type: 'wol-app',
    code: 'wol-windows',
    data: data.message,
  }
})

wsRouter.use('get-socketId', detectingSocketId, (data, ws) => {
  let socketId = ws.data.socketId
  return {
    type: 'wol-app',
    code: 'get-socketId',
    data: socketId,
  }
})

wsRouter.use('test-socket-message', (data, ws) => {
  return {
    type: 'wol-app',
    code: 'test-socket-message',
    data: '服务器收到，' + data.message,
  }
})

wsRouter.use('heartbeat', (data, ws) => {
  let socketId = ws.data.socketId
  loggerAppend(`${dayjs().format('YYYY-MM-DD-HH-mm-ss')} ${socketId} 心跳 : ${data} \n`)
  return ''
})

wsRouter.use('reply-message', (data, ws) => {
  const wsi = wsMap.get(ws.data.socketId)

  const find = wsi.messages.find(fv => {
    return fv.id === data.id
  })

  if (find) {
    find.replymsg = data.replymsg
  }
})

wsRouter.use('client', (data, ws) => {
  ws.subscribe('client')
  return {
    type: 'rtc client',
    code: 1,
  }
})

wsRouter.use('server', (data, ws) => {
  ws.subscribe('server')
  return {
    type: 'rtc server',
    code: 1,
  }
})

import { server } from '../index'

wsRouter.use('offer', (data, ws) => {
  server.publish(
    'client',
    JSON.stringify({
      type: 'A->b offer',
      code: 'offer',
      data,
    })
  )
  return 1
})

wsRouter.use('answer', (data, ws) => {
  server.publish(
    'server',
    JSON.stringify({
      type: 'b->a answer',
      code: 'answer',
      data,
    })
  )
  return 'b->a answer 1'
})

wsRouter.use('ICE-candidate', (data, ws) => {
  server.publish(
    'client',
    JSON.stringify({
      type: 'a->b ICE-candidate',
      code: 'ICE-candidate',
      data,
    })
  )
  return 'a->b ICE-candidate 1'
})

wsRouter.use('server-ICE-candidate', (data, ws) => {
  server.publish(
    'server',
    JSON.stringify({
      type: 'b->a ICE-candidate',
      code: 'server-ICE-candidate',
      data,
    })
  )
  return 'b->a ICE-candidate 1'
})

/*****
 * ********************************************************************************************************************************
 *                                                                                                                                 *
 *                                                                                                                                 *
 *                                                                                                                                 *
 *                                                                                                                                 *
 *                                                                                                                                 *
 *                                                                                                                                 *
 *                                                                                                                                 *
 * ********************************************************************************************************************************
 * **** */

router.post('/ws/test-msg', req => {
  const { socketId, msg } = req.form

  if (!msg) {
    return { code: 400, msg: '请填写消息' }
  }
  if (!wsMap.has(socketId)) {
    return { code: 404, msg: '连接找不到了 ws' }
  }

  const ws = wsMap.get(socketId)
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

router.get('/ws/list', () => {
  const list = []
  for (const [key, value] of wsMap) {
    list.push({
      socketId: key,
      userid: '暂空',
      createDate: value.createDate,
      messages: value.messages,
    })
  }
  return list
})

export const wsHttpRouter = router
