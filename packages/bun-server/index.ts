import { Router, createReq, useResponse, staticSend, cors } from './router'
import routrs from './router/routes'
// @ts-ignore
import { nanoid } from 'nanoid'
import { DATA_PATH } from './config'
import { wsMap } from './data/ws'

const router = new Router()

// 查看log的执行顺序
router.use(cors()).use(useResponse).use(staticSend()).use(routrs.routes())

const port = 7379
Bun.serve({
  port: port,
  async fetch(request, server) {
    console.log('\n请求开始')

    const websocket = server.upgrade(request, {
      data: {
        socketId: nanoid(),
      },
    })

    if (websocket) {
      console.log('websocket 链接 ===>')
      return
    }

    const req = await createReq(request, server)
    const dispatch = router.callback(req, server)
    const body = await dispatch(req, server)

    if (request.method !== 'OPTIONS') {
      console.log('结束请求')
    }

    return body
  },
  websocket: {
    open(ws: { data: { socketId: string } }) {
      
    },
    async message(ws, message) {
      console.log(ws)

      // the contextual dta is available as the `data` property
      // on the WebSocket instance
      console.log(`Received ${message} from ${ws.data}}`)
      ws.send(new Uint8Array([1, 2, 3, 4]))
    },
  },
})

console.log(`Bun server is running at http://localhost:${port}`)
