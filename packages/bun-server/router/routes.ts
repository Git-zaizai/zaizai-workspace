import { Router } from './index'
import path from 'node:path'
import fs from 'node:fs/promises'
import { DATA_PATH, UPLOAD_PATH } from '../config'
import { getUserinfo, jwtVerify, jwtSign } from '../data/user'
import { mkdirRecursive } from '../utils'
import dayjs from 'dayjs'

const router = new Router()

const JSONPATH = path.join(path.resolve(), './public/json')
const JSON_PATH_DATA = path.join(DATA_PATH, '/json')

router.get('/json/list', async req => {
  let files: { name: string; ph: string }[] = []

  const Authorization = req.headers.get('Authorization')

  if (Authorization) {
    const token = jwtVerify(Authorization)
    if (token.code === 200 && token.root) {
      let dataFiles = await fs.readdir(JSON_PATH_DATA)
      files = files.concat(dataFiles.map(fv => ({ name: fv, ph: path.join(JSON_PATH_DATA, fv) })))
    } else {
      const ip = req.headers.get('x-real-ip')
      console.log(`${dayjs().format('YYYY-MM-DDTHH:mm:ss')} 访问data json ip:${ip}`)
    }
  } else {
    let publicFiles = await fs.readdir(JSONPATH)
    files = files.concat(publicFiles.map(fv => ({ name: fv, ph: path.join(JSONPATH, fv) })))
  }

  files = files.filter(fv => fv.name.endsWith('.json'))
  let list = []
  for (const file of files) {
    const is = await fs.exists(file.ph)
    if (is) {
      let stat = await fs.stat(file.ph)
      list.push({
        name: file.name,
        birthtime: stat.birthtime,
        mtime: stat.mtime,
        size: stat.size,
        // data就是需要权限 public不需要
        code: file.ph.includes(DATA_PATH) ? 'data' : 'public',
      })
    }
  }
  return {
    data: list,
  }
})

router.get('/json/:fileName', async req => {
  const fileName = req.params.fileName
  const code = req.query.code
  let filePath
  const Authorization = req.headers.get('Authorization')

  if (code === 'data' && Authorization) {
    const token = jwtVerify(Authorization)
    if (token.code === 200 && token.root) {
      filePath = path.join(JSON_PATH_DATA, fileName)
    } else {
      const ip = req.headers.get('x-real-ip')
      console.log(`${dayjs().format('YYYY-MM-DDTHH:mm:ss')} 访问data json file:${fileName} ip:${ip}`)
      req.status = token.code
      return token.msg
    }
  } else {
    filePath = path.join(JSONPATH, fileName)
  }

  const is = await fs.exists(filePath)
  if (is) {
    return Bun.file(filePath)
  }
  return {
    msg: '文件不存在',
    code: 500,
  }
})

router.post('/json/set/:fileName', req => {
  const form = req.form
  const fileName = req.params.fileName

  if (!fileName) {
    return {
      code: 400,
      msg: '请传入文件名',
    }
  }

  if (!form) {
    return {
      code: 400,
      msg: '内容不能为空',
    }
  }

  const code = form.code
  let filePath
  if (code === 'data') {
    if (!req.mate.token) {
      return {
        code: 401,
        msg: '无权限',
      }
    }
    filePath = path.join(JSON_PATH_DATA, fileName + '.json')
  } else {
    filePath = path.join(JSONPATH, fileName + '.json')
  }

  if (typeof form === 'string') {
    Bun.write(filePath, form)
  } else {
    try {
      let value = ''
      if (form.code) {
        value = form.data
      } else {
        value = JSON.stringify(form)
      }
      Bun.write(filePath, value)
      return 'ok'
    } catch (error) {
      return {
        code: 500,
        errMsg: error.toString(),
      }
    }
  }
})

router.get('/delete/:name', async req => {
  try {
    const name = req.params.name
    await fs.rm(path.join(__dirname, '../public/json/' + name + '.json'))
    return 'ok'
  } catch (e) {
    console.log(e)
    return {
      code: 500,
      msg: e.toString(),
    }
  }
})

router.post('/secretkey', req => {
  const pwd = req.form.pwd
  if (!pwd) {
    req.status = 400
    return { msg: '请输入密钥' }
  }
  const userinfo = getUserinfo(pwd)
  if (!userinfo) {
    req.status = 400
    return { msg: '密钥错误' }
  }
  const token = jwtSign({ name: userinfo.name }, { expiresIn: '30d' })
  req.setHeader('Authorization', token)
  return token
})

router.get('/verify', req => {
  const token = req.headers.get('Authorization')
  if (!token) {
    req.status = 401
    return { msg: '请获取密钥' }
  }
  const userinfo = jwtVerify(token)
  if (userinfo.code !== 200) {
    req.status = userinfo.code
    return { msg: '请获取密钥' }
  }
  return 1
})

router.post('/upload-web', async req => {
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

import linkRoute from './link'
import { wsRouter } from '../ws/router'

router.use(linkRoute.routes()).use(wsRouter.routes())

export default router
