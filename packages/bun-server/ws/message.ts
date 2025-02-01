import { pathToRegexp, type Keys } from 'path-to-regexp'

import { RouteServerWebSocket } from '../global'

type RouteFn = (ws: RouteServerWebSocket, msg?: string) => Promise<any> | any
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

export function use(path: string, fn: RouteFn) {
  const layer = {
    path,
    regexp: pathToRegexp(path),
    fns: [fn],
    match() {
      return this.regexp.regexp.test(path)
    },
  }
  routers.push(layer)
}

export async function getMessage(ws: RouteServerWebSocket, message) {
  const matched = match(message)
  const res = []
  for (let i = 0; i < matched.length; i++) {
    const element = matched[i]
    const result = await Promise.all(element.fns.map(fn => fn(ws, message)))
    res.push(...result)
  }
  return res
}
