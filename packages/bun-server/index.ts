import { Router, createReq, useResponse, staticSend, cors } from './router'
import routrs from './router/routes'
// @ts-ignore
import { nanoid } from 'nanoid'
import { DATA_PATH } from './config'
import { wsMap } from './ws/ws'

const router = new Router()

// 查看log的执行顺序
router.use(cors()).use(useResponse).use(staticSend()).use(routrs.routes())

const port = 7379
Bun.serve({
  port: port,
  async fetch(request, server) {
    console.log('\n请求开始')

    const req = await createReq(request, server)
    console.log("🚀 ~ fetch ~ req:", req.query)
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
  websocket: {
    open(ws: { data: { socketId: string } }) {

    },
    async message(ws, message) {
      console.log(ws, message)

      // the contextual dta is available as the `data` property
      // on the WebSocket instance
      console.log(`Received ${message} from ${ws.data}}`)
      if (message === '1') {
        ws.send(JSON.stringify({ message: 'hello' }))
      } else {
        ws.send(JSON.stringify({ message: '2' }))
      }
    },
  },
})

console.log(`Bun server is running at http://localhost:${port}`)
