import { type Server } from 'bun'
import compose from './compose'
import { parse, pathToRegexp, match as pathToMatch, type MatchResult } from 'path-to-regexp'
import { safeDecodeURIComponent } from './utils'
import type { methodsType, Req, Next } from './type'

const methods = ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'].map(v => v.toLowerCase() as methodsType)

type MethodsCallback = (req: Req, serve: Server, next: Next) => any | Promise<any>

type MethodsFun = (namePath: string, middleware: MethodsCallback | MethodsCallback[]) => Router

interface RouterOptions {
  methods?: methodsType[]
  prefix?: string
  proxy?: string
}

class Router {
  private stack: Array<any>
  private middleware: Array<MethodsCallback>
  methods: Array<methodsType>
  host: string // 暂时没用
  prefix: string // 路由前缀
  /***
   * 
   * 反向代理路由前缀 
   * 比如 nginx 反向代理为 
   * location /bun-server {
        proxy_pass http://127.0.0.1:7379;
        proxy_set_header Host $host;
        proxy_set_header X-Real-PORT $remote_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    nginx 反向代理会变成 http://127.0.0.1:7379/bun-server/xxxx
    一般都是 / 开始，设置了路径反向代理就是不是从 / 开始
    所以设置这个去除 /bun-server
   */
  proxy: string
  opts: any

  head: MethodsFun
  options: MethodsFun
  get: MethodsFun
  put: MethodsFun
  patch: MethodsFun
  post: MethodsFun
  delele: MethodsFun

  constructor(opts?: RouterOptions) {
    this.opts = opts
    this.stack = []
    this.methods = opts?.methods || [...methods]
    this.host = ''
    this.prefix = ''
    this.proxy = opts?.proxy ?? ''
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
      name: '', // 暂时没用
      pathToMatch: pathToMatch(path),
      match(path) {
        // 在这里 pathToRegexp() 返回了一个对象，然后正则在regexp.regexp上
        return this.regexp.regexp.test(path)
      },
      params(captures: MatchResult<any>) {
        let params = {}
        for (const key in captures.params) {
          let c = captures.params[key]
          params[key] = c ? safeDecodeURIComponent(c) : c
        }
        return params
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
      if (this.proxy && req.pathname.includes(this.proxy)) {
        req.pathname = req.pathname.replace(this.proxy, '/')
      }

      const route = this.match(pathname, method)
      /* if (!route.route) {
        if (next) {
          return await next()
        }
        return await next()
      } */
      const layerChain = []

      if (route && route.pathAndMethod.length > 0) {
        for (let i = 0, len = route.pathAndMethod.length; i < len; i++) {
          const stack = route.pathAndMethod[i]
          req.params = stack.params(stack.pathToMatch(req.pathname))
          layerChain.push(...stack.stack)
        }
      }

      if (layerChain.length === 0) {
        req.status = 404
      }

      const middleware = this.middleware
      const composeFns = [].concat(middleware, layerChain)

      return compose(composeFns)(req, server, next)
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

      if (Array.isArray(item)) {
        for (const route of item) {
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
