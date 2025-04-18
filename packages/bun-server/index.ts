import './env'
import { Router, createReq, useResponse, staticSend, cors } from './plugins/router'
import routrs from './router/routes'
// @ts-ignore
import { nanoid } from 'nanoid'
import webSocketHandler from './ws'
import { usePriveartRoute } from './plugins/useToken'

const router = new Router({
  proxyPrefix: process.env.ZAI_ROUTER_RPEFIX,
})

// 查看log的执行顺序
router.use(cors()).use(useResponse).use(usePriveartRoute()).use(staticSend()).use(routrs.routes())

const server = Bun.serve({
  port: Number(process.env.ZAI_PORT),
  async fetch(request, server) {
    console.log('\n请求开始')

    const req = await createReq(request, server)

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

    /* if (request.method !== 'OPTIONS') {
      console.log('结束请求')
    }
 */
    console.log('结束请求\n')
    return body
  },
  websocket: webSocketHandler,
})

import { getLocalIP } from './utils'

console.log(
  `Bun server is running at http://localhost:${process.env.ZAI_PORT} \nip: http://${getLocalIP()}:${
    process.env.ZAI_PORT
  }`
)

export { server }
