import { type Server } from 'bun'
import compose from './compose'
import { parse, pathToRegexp } from 'path-to-regexp'

import type { methodsType, Req, Next } from './type'

const methods = ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'].map(v => v.toLowerCase())

type MethodsCallback = (req: object, serve: Server, next: Next) => any | Promise<any>

type MethodsFun = (namePath: string, middleware: MethodsCallback | MethodsCallback[]) => Router

class Router {
  private stack: Array<any>
  private middleware: Array<MethodsCallback>
  methods: Array<methodsType>
  host: string
  prefix: string
  opts: any

  head: MethodsFun
  options: MethodsFun
  get: MethodsFun
  put: MethodsFun
  patch: MethodsFun
  post: MethodsFun
  delele: MethodsFun

  constructor(opts?: any) {
    this.opts = opts
    this.stack = []
    this.methods = opts?.methods || [...methods]
    this.host = ''
    this.prefix = ''
    this.middleware = []

    for (const method of methods) {
      this[method] = this.createMethod(method as methodsType)
    }
  }

  private createLayer(path, method, middleware) {
    const layer = {
      path: path,
      methods: method.map(v => v.toLowerCase()),
      stack: Array.isArray(middleware) ? middleware : [middleware],
      regexp: pathToRegexp(this.prefix + path),
      name: '',
      match(path) {
        return this.regexp.regexp.test(path)
      },
    }
    return layer
  }

  private register(path: string, methods: methodsType | methodsType[], middleware: MethodsCallback[], opts = {}) {
    const { stack } = this

    /**
     * 注册路由可以已数组的方式
     */
    if (Array.isArray(path)) {
      for (const curPath of path) {
        this.register.call(this, curPath, methods, middleware, opts)
      }
      return this
    }

    const route = this.createLayer(path, methods, middleware)
    stack.push(route)

    return route
  }

  private match(path, method) {
    const layers = this.stack
    let layer
    const matched = {
      path: [],
      pathAndMethod: [],
      route: false,
    }

    for (let len = layers.length, i = 0; i < len; i++) {
      layer = layers[i]
      // eslint-disable-next-line unicorn/prefer-regexp-test
      if (layer.match(path)) {
        matched.path.push(layer)
        if (layer.methods.length === 0 || layer.methods.includes(method)) {
          matched.pathAndMethod.push(layer)
          if (layer.methods.length > 0) matched.route = true
        }
      }
    }

    return matched
  }

  callback(req: Req, server: Server) {
    const { pathname, method } = req
    const dispatch = async (req: Req, server: Server, next?: Next) => {
      const route = this.match(pathname, method)
      /* if (!route.route) {
        if (next) {
          return await next()
        }
        return await next()
      } */
      const layerChain = []
     
      if (route && route.pathAndMethod.length > 0) {
        route.pathAndMethod.forEach(stack => {
          layerChain.push(...stack.stack)
        })
      }
      const middleware = this.middleware.reverse()
      return compose([].concat(middleware, layerChain))(req, server, next)
    }

    dispatch.router = this

    return dispatch
  }

  private createMethod(method: methodsType): MethodsFun {
    return (namePath: string, middleware: MethodsCallback | MethodsCallback[]) => {
      middleware = Array.isArray(middleware) ? middleware : [middleware]
      this.register(namePath, [method], middleware, { name: '' })
      return this
    }
  }

  use(...fu: any[]) {
    const { middleware, stack } = this

    for (const item of fu) {
      if (typeof item === 'function') {
        middleware.push(...fu)
      }

      if (Array.isArray(fu[0])) {
        for (const route of fu[0]) {
          if (route.stack) {
            stack.push(route)
          }
        }
      }
    }

    return this
  }

  routes() {
    return this.stack
  }
}

export default Router
