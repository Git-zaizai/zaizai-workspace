import { type Server } from 'bun'
import type { Req, methodsType } from './type'
import { createRes } from './createRes'
export async function createReq(request: Request, server: Server): Promise<Req> {
  const url = new URL(request.url)
  const res = createRes()

  let form = null
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
    const contentType = request.headers.get('Content-Type') || ''
    try {
      if (contentType.includes('application/json')) {
        form = await request.json()
      } else if (contentType.includes('multipart/form-data')) {
        form = await request.formData()
      } else {
        form = await request.text()
      }
    } catch (error) {
      form = {}
    }
  }

  let query = null
  if (request.method === 'GET' || request.method === 'DELETE' || request.method === 'HEAD') {
    query = url.searchParams
  }

  const req = {
    method: request.method.toLowerCase() as methodsType,
    url: request.url,
    headers: request.headers,
    origin: url.origin,
    href: url.href,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    hash: url.hash,
    search: url.search,
    searchParams: url.searchParams,
    toJSON: url.toJSON,
    toString: url.toString,
    request,
    server,
    res,

    get body() {
      return this.res.body
    },

    set body(value) {
      this.res.body = value
    },

    get status() {
      return res.status
    },

    set status(value: number) {
      this.res.status = value
    },

    setHeader(key: string, value: string) {
      this.res.headers.set(key, value)
    },

    params: null,

    query,

    form,

    mate: {},
  }

  return req
}
