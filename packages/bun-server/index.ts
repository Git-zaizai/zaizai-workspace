import Router from './router'
import { createReq } from './router/createReq'
import { useResponse } from './router/useResponse'
import staticSend from './router/static-send'

const router = new Router()

router.use(staticSend()).use(useResponse)

staticSend()
Bun.serve({
  port: 7379,
  async fetch(request, server) {
    const req = createReq(request, server)
    const dispatch = router.callback(req, server)
    const rsep = await dispatch(req, server)
    console.log("🚀 ~ fetch ~ rsep:", rsep)
    return rsep
  },
})



console.log('Bun server is running at http://localhost:7379')
