import { serve, fetch } from 'bun'

const methods = ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'].map(v => v.toLowerCase())
type methodsType = typeof methods

class Router {
  stack: Array<Function>
  opts: any
  methods: Array<methodsType>
  host: string
  constructor(opts) {
    this.opts = opts
    this.stack = []
    this.methods = this.opts.methods || [...methods]
    this.host = ''
  }

  createLayer() {
    return {}
  }

  register(path: string, methods: methodsType, middleware: Array<Function>, opts = {}) {}

  callback(request, server) {}
}
