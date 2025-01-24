import dayjs from 'dayjs'
import { Router } from '../router'
import { wait } from '../utils'
import path from 'node:path'
import fs from 'node:fs/promises'

const router = new Router()

router.get('/api/tabs', () => {
  return ['tab1', 'tab2', 'tab3', 'tab4']
})

router.get('/api/table', async () => {
  const res = new Array(100).fill(null).map((_, i) => {
    return {
      _id: i,
      title: 'title' + i,
      start: 0,
      finish: 0,
      duwan: 1,
      tabs: [],
      wanjie: 1,
      isdel: 1,
      link: '',
      linkback: '',
      beizhu: '',
      links: [],
      addDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      update: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      finishtime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      rate: '',
      id: 0,
    }
  })

  await wait()
  return res
})

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

export default router
