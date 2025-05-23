import type { Req, Server, Next } from './router'

export const cors = (headers: object = {}) => {
  return async (req: Req, server: Server, next: Next) => {
    console.log(`cors ===> req.method: ${req.method}`)

    req.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
    req.setHeader('Access-Control-Allow-Origin', req.headers.get('origin') || '*')

    if (req.method === 'options') {
      req.setHeader('Access-Control-Allow-Credentials', 'true')
      req.setHeader('Access-Control-Allow-Headers', 'content-type,info,Authorization,X-File-Size,X-File-Name')
      req.setHeader('Access-Control-Max-Age', '86400')
      return new Response(null, {
        status: 204,
        headers: req.res.headers,
      })
    }

    const body = await next()
    console.log('cors <===')
    return body
  }
}
