import path from 'node:path'
import fs from 'node:fs'
import type { Req, Server, Next } from './type'

export default (pathName: string = './public') => {
  const fileList = []
  // @ts-ignore
  const filePath = path.join(path.resolve(), pathName)
  // 检查路径是否存在
  if (!fs.existsSync(filePath)) {
    throw new Error(`路径不存在: ${filePath}`)
  }
  const alldir = fs.readdirSync(filePath, { recursive: true }) as string[]

  for (const dir of alldir) {
    const dirStat = fs.statSync(path.join(filePath, dir))
    if (dirStat.isFile()) {
      fileList.push(dir.replace(/\\/g, '/'))
    }
  }

  return async (req: Req, server: Server, next: Next) => {
    const responseData = await next()
    let body = responseData || req.body

    let urlPath
    if (req.method !== 'head' && req.method !== 'get') {
      return body
    }

    if (!body && req.pathname === '/') {
      return new Response(Bun.file(path.join(filePath, 'index.html')))
    }

    try {
      urlPath = decodeURIComponent(req.pathname)
    } catch {
      return body
    }
    urlPath = urlPath.replace('/public/', '')

    if (!fileList.includes(urlPath)) {
      return body
    }

    const file = Bun.file(path.join(filePath, urlPath))
    return new Response(file)
  }
}
