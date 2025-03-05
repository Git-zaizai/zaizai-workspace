import { pathToRegexp, type Keys } from 'path-to-regexp'
import { RouteServerWebSocket } from '../global'
import compose from '../plugins/router/lib/compose'

type RouteFn = (ws: RouteServerWebSocket, msg?: any, next?: () => any) => Promise<any> | any
interface Layer {
  path: string
  regexp: {
    regexp: RegExp
    keys: Keys
  }
  fns: RouteFn[]
  match: (path: string) => boolean
}

const routers: Layer[] = []

export function getRouters() {
  return routers
}

export function match(path: string) {
  if (!path) {
    return {
      path: [],
    }
  }

  const matched = {
    path: [],
  }

  for (let len = routers.length, i = 0; i < len; i++) {
    let layer = routers[i]
    if (layer.match(path)) {
      matched.path.push(layer)
    }
  }

  return matched.path
}

export function use(path: string, ...fns: RouteFn[]) {
  if (fns.some(fn => typeof fn !== 'function')) {
    throw new TypeError('Middleware must be composed of functions.')
  }
  const layer = {
    path,
    regexp: pathToRegexp(path),
    fns,
    match(matchPath: string) {
      return this.regexp.regexp.test(matchPath)
    },
  }
  routers.push(layer)
}

export async function getMessage(ws: RouteServerWebSocket, message) {
  let messageData
  try {
    messageData = JSON.parse(message)
  } catch {
    messageData = message
  }
  let matched = null

  if (typeof messageData === 'object' && 'route' in messageData) {
    matched = match(messageData.route)
  } else {
    matched = match(messageData)
  }

  if (matched.length === 0) {
    return ''
  }

  return compose(matched[0].fns)(ws, messageData.data, matched[0].fns[0])
}
