Bun.serve({
  fetch(request, server) {
    return new Response('Hello, world!')
  },
})
