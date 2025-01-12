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
console.log('🚀 ~ JSONPATH:', JSONPATH)
router.get('/json/:file', async req => {
  const files = await fs.readdir(JSONPATH)
  let list = []
  for (const file of files) {
    let stat = await fs.stat(path.join(JSONPATH, file))
    list.push({
      name: file,
      birthtime: stat.birthtime,
      mtime: stat.mtime,
      size: stat.size,
    })
  }
  return list
})

export default router
