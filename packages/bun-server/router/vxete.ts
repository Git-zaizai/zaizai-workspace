import { Router } from '../plugins/router/index'
import fs from 'fs'
import path from 'path'

const router = new Router()

let vxetePh
let vxeteJsonPh
if (Bun.env.NODE_ENV === 'production') {
  vxetePh = '/www/txt/vxete.com/txt-utf8'
  vxeteJsonPh = '/www/txt/vxete.com/chapters'
} else {
  vxetePh = 'F:\\M-clone\\nodedemo\\vxete.com\\txt-utf8'
  vxeteJsonPh = 'F:\\M-clone\\nodedemo\\vxete.com\\chapters'
}
const txtFiles = fs.readdirSync(vxetePh)
const jsonFiles = fs.readdirSync(vxeteJsonPh)

const jsonFilters = ['chapters_index_summary.json']

router.get('/vxete/page/:page/:pageSize', async req => {
  try {
    const page = req.params.page
    const pageSize = req.params.pageSize
    const start = (page - 1) * pageSize
    const end = page * pageSize
    const files = jsonFiles.slice(start, end).filter(fv => !jsonFilters.includes(fv))

    const result = []
    for (const file of files) {
      const filePath = path.join(vxeteJsonPh, file)
      const content = await Bun.file(filePath).json()
      result.push(content)
    }
    return {
      data: result,
      total: jsonFiles.length,
    }
  } catch (err) {
    console.log(err)
    return {
      code: 500,
      msg: '服务器错误',
    }
  }
})

router.post('/vxete/search', async req => {
  const body = req.form
  const fileName = body.fileName
  const author = body.author
  const result = []
  for (const file of jsonFiles) {
    if (file.includes(fileName)) {
      const filePath = path.join(vxeteJsonPh, file)
      const content = await Bun.file(filePath).json()
      result.push(content)
    }
    if (author && file.includes(author)) {
      if (result.some(item => item.file === file)) {
        continue
      }
      const filePath = path.join(vxeteJsonPh, file)
      const content = await Bun.file(filePath).json()
      result.push(content)
    }
  }
  return {
    data: result,
    total: result.length,
  }
})

router.get('/vxete/:file', async req => {
  let file = req.params.file
  if (!file) {
    return new Response('文件不存在', { status: 404 })
  }
  file = decodeURIComponent(file)
  if (!file) {
    return new Response('文件不存在', { status: 404 })
  }
  const filePath = path.join(vxetePh, file)
  if (!fs.existsSync(filePath)) {
    return new Response('文件不存在', { status: 404 })
  }

  // 获取文件信息
  const fileStats = fs.statSync(filePath)
  const fileSize = fileStats.size
  const fileName = path.basename(filePath)

  // 设置下载响应头
  return new Response(Bun.file(filePath), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      'Content-Length': fileSize.toString(),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
})

export default router
