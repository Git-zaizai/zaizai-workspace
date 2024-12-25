import { route } from './routes'
Bun.serve({
  port: 7379,
 async fetch(request, server) {
    const url = new URL(request.url)
    const res = await route[url.pathname]?.()
    return res
  },
})

console.log('Bun server is running at http://localhost:7379')
