import { route } from './routes'

import Koa from 'koa'
import Router from '@koa/router'

const app = new Koa()
const router = new Router()

router.get('/', async ctx => {
  console.log('🚀 ~ router.get ~ ctx:', ctx.req)

  ctx.body = 'Hello Bun!'
})

app.use(router.routes()).use(router.allowedMethods())

/* Bun.serve({
  port: 7379,
  async fetch(request, server) {
    const url = new URL(request.url)
    const res = await route[url.pathname]?.()
    return res
  },
}) */

app.listen(7379)

console.log('Bun server is running at http://localhost:7379')
