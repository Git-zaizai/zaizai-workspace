import Router from './lib'
import { createReq } from './lib/createReq'
import { useResponse } from './lib/useResponse'

const router = new Router()

router.use(useResponse)

router.get('/', () => {
  console.log('路由');
  
  return 'Hello, Bun!'
})

Bun.serve({
  port: 7379,
  async fetch(request, server) {
    const req = createReq(request, server)
    const dispatch = router.callback(req, server)
    const rsep = await dispatch(req, server)
    return rsep
  },
})

console.log('Bun server is running at http://localhost:7379')
