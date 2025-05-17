import './env'
import { Router, createReq } from './plugins/router'
import { useResponse } from './plugins/useResponse'
import { staticSend } from './plugins/static-send'
import { cors } from './plugins/cors'
import routrs from './router/routes'
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
    console.log('结束请求 ===' + `ph ${req.pathname}`)
    return body
  },
  websocket: webSocketHandler,
})

import { getLocalIP } from './utils'

console.log(
  `Bun server is running at http://localhost:${server.port}${router.proxyPrefix} \nip: http://${getLocalIP()}:${server.port
  }`
)

export { server }