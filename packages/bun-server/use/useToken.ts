import { pathToRegexp } from 'path-to-regexp'
import type { Req, Server, Next } from '../router/index'
import { jwtVerify } from '../data/user'

const privateRoutes: string[] = [
  '/link/tags',
  '/link/table',
  '/link/detele',
  '/ws/test-msg',
  '/ws/get-test-msg',
  '/ws/list',
]

export const PRIVATE_ROUTES = privateRoutes.map(item => pathToRegexp(item))

const PRIVATE_ROUTES_LENG = PRIVATE_ROUTES.length

const matchRoute = (pathname: string) => {
  for (let i = 0; i < PRIVATE_ROUTES_LENG; i++) {
    const item = PRIVATE_ROUTES[i]
    if (item.regexp.test(pathname)) {
      return true
    }
  }
  return false
}

export const usePriveartRoute = (routers?: string[]) => {
  return async (req: Req, server: Server, next: Next) => {
    console.log('usePriveartRoute ===>')
    if (PRIVATE_ROUTES.length === 0) {
      console.log('usePriveartRoute <===')
      return next()
    }
    const { pathname } = req

    if (!matchRoute(pathname)) {
      console.log('usePriveartRoute <===')
      return next()
    }

    const Authorization = req.headers.get('Authorization')
    if (!Authorization) {
      req.status = 401
      console.log('usePriveartRoute <===')
      return '请先获取令牌'
    }

    const isjwt = jwtVerify(Authorization)
    if (isjwt.code === 200) {
      req.mate.token = { code: isjwt.code, msg: isjwt.msg, ...isjwt.data }
      console.log('usePriveartRoute <===')
      return next()
    } else {
      req.status = isjwt.code
      return isjwt.msg
    }
    /* try {
      const token = jwtVerify(Authorization)
      req.mate.token = token
      console.log('usePriveartRoute <===')
      return next()
    } catch (e) {
      console.log('usePriveartRoute <===')
      if (e.name === 'TokenExpiredError') {
        req.status = 401
        return '令牌已过期'
      } else if (e.name === 'JsonWebTokenError') {
        req.status = 401
        return '令牌无效'
      } else if (e.name === 'NotBeforeError') {
        req.status = 401
        return '令牌尚未生效'
      } else {
        req.status = 401
        return '未知错误，请重新获取'
      }
    } */
  }
}
