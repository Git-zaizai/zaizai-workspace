import { pathToRegexp } from 'path-to-regexp'
import type { Req, Server, Next } from './router/index'
import { jwtVerify } from '../data/user'

// 存放需要验证的路由
const privateRoutes: string[] = [
  '/link/tags',
  '/link/table',
  '/link/detele',
  '/ws/test-msg',
  '/ws/get-test-msg',
  '/ws/list',
  //
  '/scheduled-flie-list',
  '/scheduled-file-content',
  '/scheduled-add',
  '/open-tasks',
  '/manual-start-tasks',
  '/stop-tasks',
  '/deldet-tashks',
  '/runner',
  '/upload-runfile',
]
// 通配 /test/**/**
if (process.env.NODE_ENV === 'development') {
  privateRoutes.push('/test/:xx')
}

export let PRIVATE_ROUTES = privateRoutes.map(item => pathToRegexp(item))

let PRIVATE_ROUTES_LENG = PRIVATE_ROUTES.length

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
  routers && (PRIVATE_ROUTES = routers.map(item => pathToRegexp(item)))
  PRIVATE_ROUTES_LENG = PRIVATE_ROUTES.length

  return async (req: Req, server: Server, next: Next) => {
    console.log('usePriveartRoute ===>')

    if (PRIVATE_ROUTES.length === 0) {
      return next()
    }
    const { pathname } = req

    if (!matchRoute(pathname)) {
      return next()
    }

    const Authorization = req.headers.get('Authorization')
    if (!Authorization) {
      req.status = 401
      return '请先获取令牌'
    }

    const isjwt = jwtVerify(Authorization)
    if (isjwt.code === 200) {
      req.mate.token = { code: isjwt.code, msg: isjwt.msg, ...isjwt.data }
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
