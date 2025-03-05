import type { Res } from './type'

export function createRes(): Res {
  const headers = new Headers()
  // 默认设置响应头 Content-Type
  // headers.set('Content-Type', 'application/json; charset=utf-8')
  return {
    headers,
    status: 204,
    body: null,
  }
}
