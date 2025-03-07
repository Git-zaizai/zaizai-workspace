import { pathToRegexp, type Keys } from 'path-to-regexp'
import { RouteServerWebSocket } from '../global'
import compose from '../plugins/router/lib/compose'

type RouteFn = (message?: any, ws?: RouteServerWebSocket, next?: () => any) => Promise<any> | any
interface Layer {
  path: string
  regexp: {
    regexp: RegExp
    keys: Keys
  }
  fns: RouteFn[]
  match: (path: string) => boolean
}

export default class wsRouter {
  private middleware: RouteFn[]
  private routes: Layer[]
  constructor() {
    this.middleware = []
    this.routes = []
  }

  private match(path) {
    const matcheds = []
    for (let len = this.routes.length, i = 0; i < len; i++) {
      let layer = this.routes[i]
      if (layer.match(path)) {
        matcheds.push(...layer.fns)
      }
    }
    return this.middleware.concat(matcheds)
  }

  useMiddleware(fn: RouteFn) {
    this.middleware.push(fn)
  }

  use(ph: string, fn: RouteFn, ...args: RouteFn[]) {
    const layer = {
      path: ph,
      regexp: pathToRegexp(ph),
      fns: [fn].concat(args),
      match(matchPath: string) {
        return this.regexp.regexp.test(matchPath)
      },
    }
    this.routes.push(layer)
  }

  async callback(ws: RouteServerWebSocket, message) {
    let messageData
    try {
      messageData = JSON.parse(message)
    } catch {
      messageData = message
    }
    let matched = null

    if (typeof messageData === 'object' && 'route' in messageData) {
      matched = this.match(messageData.route)
    } else {
      matched = this.match(messageData)
    }

    if (matched.length === 0) {
      return ''
    }
    return await compose(matched)(messageData.data, ws, matched[0])
  }
}
