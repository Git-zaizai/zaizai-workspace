import { Router } from './index'
import { mkdirRecursive, existsFile } from '../utils'
import dayjs from 'dayjs'
import { DATA_PATH, UPLOAD_PATH, CACHE_PATH } from '../config'
import path from 'node:path'
import fs from 'node:fs/promises'

const router = new Router()

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

export default router
