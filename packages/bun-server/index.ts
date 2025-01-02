import { route } from './routes'
import { parse, pathToRegexp } from 'path-to-regexp'

type Req = {
  
} & URL & Request

Bun.serve({
  port: 7379,
  async fetch(request, server) {
    const url = new URL(request.url)
    const req = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      origin: url.origin,
      href: url.href,
      protocol: url.protocol,
      username: url.username,
      password: url.password,
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
    }

    if (route[url.pathname]) {
      return route[url.pathname]?.()
    }
    return new Response('bun server')
  },
})

console.log('Bun server is running at http://localhost:7379')
