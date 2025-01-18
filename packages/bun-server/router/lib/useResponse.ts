import type { Req, Server, Next } from './type'

export async function useResponse(req: Req, server: Server, next: Next) {
  console.log('useResponse ===>')
  const responseData = await next()
  console.log('useResponse <===')

  let body = responseData || req.body
  const headers = new Headers(req.res.headers)

  if (body instanceof Response) {
    headers.forEach((value, key) => {
      body.headers.set(key, value)
    })
    return body
  }

  if (body === null) {
    headers.delete('Content-Type')
    headers.delete('Content-Length')
    headers.delete('Transfer-Encoding')
    return new Response(null, { headers, status: 204 })
  }

  const status = req.status === 204 ? 200 : req.status
  if (body instanceof Blob) {
    return new Response(body, {
      status,
      headers,
    })
  }

  headers.set('Content-Type', 'application/json; charset=utf-8')
  const response = { code: 200, msg: 'OK', data: body }

  return new Response(JSON.stringify(response), {
    status,
    headers,
  })
}
