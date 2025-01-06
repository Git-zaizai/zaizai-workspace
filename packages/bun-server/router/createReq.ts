import { type Server } from 'bun'
import type { Req, methodsType } from './type'
import { createRes } from './createRes'
export function createReq(request: Request, server: Server): Req {
  const url = new URL(request.url)
  const res = createRes()
  const req = {
    method: request.method.toLowerCase(),
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
    body: null,

    get status() {
      return res.status
    },

    set status(value: number) {
      this.res.status = value
    },

    setHeader(key: string, value: string) {
      this.res.headers.set(key, value)
    },
  }

  return req
}
