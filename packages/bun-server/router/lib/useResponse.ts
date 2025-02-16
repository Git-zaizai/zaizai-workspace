import { val } from 'node_modules/cheerio/dist/commonjs/api/attributes'
import type { Req, Server, Next } from './type'
// @ts-ignore
import { isNull, isUndefined, isObject } from 'lodash-es'

function isPrimitive(value: any): boolean {
  return (
    value === undefined ||
    value === null ||
    Array.isArray(val) ||
    (typeof value !== 'object' && typeof value !== 'function')
  )
}

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

  if (req.status === 401) {
    return new Response(body, { headers, status: req.status })
  }

  if (isUndefined(body) || isNull(body)) {
    headers.delete('Content-Type')
    headers.delete('Content-Length')
    headers.delete('Transfer-Encoding')
    return new Response(null, { headers, status: req.status || 204 })
  }

  const status = req.status === 204 ? 200 : req.status
  if (body instanceof Blob) {
    return new Response(body, {
      status,
      headers,
    })
  }

  headers.set('Content-Type', 'application/json; charset=utf-8')

  let response
  
  if (isPrimitive(body)) {
    response = { code: 200, msg: 'OK', data: body }
  } else {
    response = Object.assign({ code: 200, msg: 'OK', data: null }, body)
  }

  return new Response(JSON.stringify(response), {
    status,
    headers,
  })
}
