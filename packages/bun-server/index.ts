import { Router, createReq, useResponse, staticSend, cors } from './router'
import routrs from './router/routes'
const router = new Router()

// 查看log的执行顺序
router.use(cors()).use(useResponse).use(staticSend()).use(routrs.routes())

const port = 7379
Bun.serve({
  port: port,
  async fetch(request, server) {
    console.log('\n请求开始')

    const req = createReq(request, server)
    const dispatch = router.callback(req, server)
    const body = await dispatch(req, server)
    
    if (request.method !== 'OPTIONS') {
      console.log('结束请求')
    }

    return body
  },
})

console.log(`Bun server is running at http://localhost:${port}`)
