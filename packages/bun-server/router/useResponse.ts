import type { Req, Server, Next } from './type'

export async function useResponse(req: Req, server: Server, next: Next) {
  const responseData = await next()
  let body = responseData || req.body
  
  if (body instanceof Response) {
    return body
  }
  
  const headers = new Headers(req.headers)

  if (body === null) {
    headers.delete('Content-Type')
    headers.delete('Content-Length')
    headers.delete('Transfer-Encoding')
    return new Response(null, { headers, status: 204 })
  }

  const response = { code: 200, msg: 'OK', data: body }

  return new Response(JSON.stringify(response), {
    status: req.status,
    headers,
  })
}
