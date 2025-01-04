import type { Res } from './type'

export function createRes(): Res {
  const headers = new Headers()
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return {
    headers,
    status: 200,
    body: null,
  }
}
