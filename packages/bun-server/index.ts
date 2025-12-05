import './env'
import { Router, createReq } from './plugins/router'
import { useResponse } from './plugins/useResponse'
import { staticSend } from './plugins/static-send'
import { cors } from './plugins/cors'
import routrs from './router/routes'
import { nanoid } from 'nanoid'
import webSocketHandler from './ws'
import { usePriveartRoute } from './plugins/useToken'
import { maxRequestBodySize } from './config'
import os from 'os'
import path from 'path'

const router = new Router({
  proxyPrefix: process.env.ZAI_ROUTER_RPEFIX,
})

// 查看log的执行顺序
router.use(cors()).use(useResponse).use(usePriveartRoute()).use(staticSend()).use(routrs.routes())

const server = Bun.serve({
  maxRequestBodySize: maxRequestBodySize, // 50MB
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

const interfaces = os.networkInterfaces()
console.log(`\nBun server Local mock host:`)
// 显示本地地址
console.log(`  Local:   http://localhost:${server.port}`)
// 显示网络地址
Object.values(interfaces).forEach(iface => {
  iface.forEach(details => {
    if (details.family === 'IPv4' && !details.internal) {
      console.log(`  Network: http://${details.address}:${server.port}`)
    }
  })
})
console.log('\n')

export { server }