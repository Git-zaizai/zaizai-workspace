import { Router } from '../plugins/router/index'
import { mkdirRecursive, wait } from '../utils'
import dayjs from 'dayjs'
import { UPLOAD_PATH } from '../config'
import path from 'node:path'
import fs from 'node:fs/promises'

const router = new Router({
  prefix: '/test',
})

router.post('/upload-app', async req => {
  const form = req.form
  const file = form.get('file')

  if (!file) {
    return {
      code: 400,
      msg: '请选择文件',
    }
  }

  const current = dayjs().format('YYYY-MM-DD')
  const mkdir = path.join(UPLOAD_PATH, current)
  mkdirRecursive(mkdir)

  try {
    // console.log(file instanceof File); // true
    await Bun.write(path.join(mkdir, file.name), file)
    return {
      file_id: file.name,
      ticket: '123456',
    }
  } catch (err) {
    return {
      code: 500,
      msg: '写入文件',
    }
  }
})

router.post('/file/upload', async req => {
  const form = req.form
  const file = form.get('file')

  if (!file) {
    return {
      code: 400,
      msg: '请选择文件',
    }
  }

  const current = dayjs().format('YYYY-MM-DD')
  const mkdir = path.join(UPLOAD_PATH, current)
  mkdirRecursive(mkdir)

  try {
    // console.log(file instanceof File); // true
    await Bun.write(path.join(mkdir, file.name), file)
    return 1
  } catch (err) {
    return {
      code: 500,
      msg: '写入文件',
    }
  }
})

router.post('/stream-md', async () => {
  const md = Bun.file(path.join(UPLOAD_PATH, 'markdown.md'))
  let content:any = await md.text()
  content = content.split(/\r\n/g)
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < content.length; i++) {
        controller.enqueue(content[i] + '\n')
        await wait(500)
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
})

export default router
