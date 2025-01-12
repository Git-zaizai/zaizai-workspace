import path from 'node:path'
import fs from 'node:fs'
import type { Req, Server, Next } from './type'

export const staticSend = (
  pathName: string = './public',
  options = {
    // 如有在录下有index.html，请求 / 没有被占用旧返回index.html
    indexHtml: true,
  }
) => {
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
    console.log('staticSend ===>')
    const responseData = await next()
    console.log('staticSend <===');

    let body = responseData || req.body

    let urlPath
    if (req.method !== 'head' && req.method !== 'get') {
      return body
    }

    if (options.indexHtml && !body && req.pathname === '/') {
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