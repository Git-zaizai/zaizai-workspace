import { type Server } from 'bun'
import type { Req, methodsType } from './type'
import { createRes } from './createRes'
export async function createReq(request: Request, server: Server): Promise<Req> {
  const url = new URL(request.url)
  const res = createRes()

  let form = null
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
    form = await request.json()
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

    query: null,

    form,
  }

  return req
}
