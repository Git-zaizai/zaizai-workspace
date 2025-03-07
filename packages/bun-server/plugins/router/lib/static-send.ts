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

  console.log('fileList', fileList)

  return async (req: Req, server: Server, next: Next) => {
    console.log('staticSend ===>')
    const responseData = await next()
    console.log('staticSend <===')

    let body = responseData || req.body
    if (body && body.status === 200) {
      return body
    }

    let urlPath
    if (req.method !== 'head' && req.method !== 'get') {
      return body
    }

    // options.indexHtml &&  body.status === 404 && req.pathname === '/' 由于路由顺序改变 useResponse 在前
    // 往下没有找不到路由，默认body=null了，所以在这里直接 if body
    if (options.indexHtml && !body && req.pathname === '/') {
      const html = path.join(filePath, 'index.html')
      if (fs.existsSync(html)) {
        return new Response(Bun.file(html))
      }
    }

    try {
      urlPath = decodeURIComponent(req.pathname)
    } catch {
      return body
    }
    urlPath = urlPath.replace('/public/', '')
    // 移除路径中的第一个斜杠
    if (urlPath.startsWith('/')) {
      urlPath = urlPath.substring(1)
    }

    if (!fileList.includes(urlPath)) {
      return body
    }

    const file = Bun.file(path.join(filePath, urlPath))
    return new Response(file)
  }
}
