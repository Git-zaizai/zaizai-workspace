import type { Server } from 'bun'
export { Server }

export type Params = Record<string, string>

export type Form = Record<string, string>

export type methodsType = 'head' | 'options' | 'get' | 'put' | 'patch' | 'post' | 'delete'

export type Res = {
  headers: Headers
  status: number
  body: any
}

export type Req = {
  method: methodsType
  url: string
  headers: Headers
  origin: string
  href: string
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  hash: string
  search: string
  searchParams: Object
  toJSON: () => string
  toString: () => string
  request: Request
  server: Server
  res: Res
  status: number
  body: any
  setHeader: (key: string, value: string) => void
  params: Params | null
  query: Params | null
  form: Form | null

  mate: Params
}

export type Next = () => any | Promise<any>
