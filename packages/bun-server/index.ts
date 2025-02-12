import { Router, createReq, useResponse, staticSend, cors } from './router'
import routrs from './router/routes'
// @ts-ignore
import { nanoid } from 'nanoid'
import webSocketHandler from './ws'
import { usePriveartRoute } from './use/useToken'

const router = new Router()

// 查看log的执行顺序
router.use(cors()).use(useResponse).use(staticSend()).use(usePriveartRoute()).use(routrs.routes())

const port = 7379
Bun.serve({
  port: port,
  async fetch(request, server) {
    console.log('\n请求开始')

    const req = await createReq(request, server)
    console.log('🚀 ~ fetch ~ req:', req.query)
    const websocket = server.upgrade(request, {
      data: {
        socketId: nanoid(),
      },
    })

    if (websocket) {
      console.log('websocket 链接 ===>')
      return
    }

    const dispatch = router.callback(req, server)
    const body = await dispatch(req, server)

    if (request.method !== 'OPTIONS') {
      console.log('结束请求')
    }

    return body
  },
  websocket: webSocketHandler,
})

console.log(`Bun server is running at http://localhost:${port}`)
