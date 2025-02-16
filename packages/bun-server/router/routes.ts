import { Router } from './index'
import path from 'node:path'
import fs from 'node:fs/promises'

const router = new Router()

const JSONPATH = path.join(path.resolve(), './public/json')

router.get('/json/list', async req => {
  const files = await fs.readdir(JSONPATH)
  let list = []
  for (const file of files) {
    const filePath = path.join(JSONPATH, file)
    const is = await fs.exists(filePath)
    if (is) {
      let stat = await fs.stat(filePath)
      list.push({
        name: file,
        birthtime: stat.birthtime,
        mtime: stat.mtime,
        size: stat.size,
      })
    }
  }
  return list
})

router.get('/json/:fileName', async req => {
  const fileName = req.params.fileName
  const filePath = path.join(JSONPATH, fileName)
  const is = await fs.exists(filePath)
  if (is) {
    return Bun.file(path.join(JSONPATH, fileName))
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

  const filePath = path.join(JSONPATH, fileName + '.json')
  if (typeof form === 'string') {
    Bun.write(filePath, form)
  } else {
    try {
      let value = JSON.stringify(form)
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

import { getUserinfo } from '../data/user'
import { jwtVerify, jwtSign } from '../utils'

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
  const token = jwtSign({ name: userinfo.username }, { expiresIn: '30d' })
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
  if (!userinfo) {
    req.status = 401
    return { msg: '请获取密钥' }
  }
  return 1
})

import linkRoute from './link'

router.use(linkRoute.routes())

export default router
