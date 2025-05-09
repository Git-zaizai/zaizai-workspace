import dayjs from 'dayjs'
import { Router } from '../plugins/router/index'
import path from 'node:path'
import { DATA_PATH, CACHE_PATH_JSON } from '../config'
// @ts-ignore
import { nanoid } from 'nanoid'

const router = new Router()

const JSON_PATH = path.join(DATA_PATH, '/json')
const novelFilePath = path.join(JSON_PATH, 'novel.json')



// 由于现在使用json文件， 这个代码用于生成id
// Bun.file(novelFilePath)
//   .json()
//   .then((res: any[]) => {
//     res.forEach(item => {
//       const nid = nanoid()
//       if (!res.some(sv => sv.id === nid)) {
//         item.id = nanoid()
//       }
//     })
//     return res
//   })
//   .then(res => {
//     return Bun.write(novelFilePath, JSON.stringify(res))
//   })


router.get('/link/tags', async () => {
  return Bun.file(`${JSON_PATH}/tags.json`)
})

router.get('/link/table', async () => {
  const NODE_ENV = Bun.env.NODE_ENV
  
  if (NODE_ENV=== 'development' || !NODE_ENV) {
    const data = Bun.file(novelFilePath)
    let res = await data.json()
    res = res.map((item: any, i) => {
      item.title = 'xxxxxxx' + i
      return item
    })
    return new Response(JSON.stringify(res))

  } else {
    return Bun.file(novelFilePath)
  }
})
/**
 * {
      _id: '',
      title: '',
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
      addDate: null,
      update: null,
      finishtime: null,
      rate: '',
      id: 0,
    }
 */
router.post('/link/add', async req => {
  const form = req.form
  const novel: any[] = await Bun.file(novelFilePath).json()

  if (novel.some(sv => sv.title === form.title)) {
    return { msg: '已有' }
  }

  /* if (!form['_id']) {
    form['_id'] = nanoid()
  } */

  form.id = nanoid()
  const date = dayjs()
  form.addDate = date
  form.finishtime = dayjs()
  form.update = dayjs()
  form.isdel = 1

  try {
    novel.push(form)
    await Bun.write(novelFilePath, JSON.stringify(novel))
    return { data: form }
  } catch (err) {
    return { code: 500, msg: '写入错误', err: err.toString() }
  }
})

router.get('/link/detele', async req => {
  const id = req.query.id
  const novel: any[] = await Bun.file(novelFilePath).json()
  try {
    await Bun.write(
      path.join(CACHE_PATH_JSON, `novel-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.json`),
      JSON.stringify(novel)
    )
    const index = novel.findIndex(fv => fv.id === id)
    novel.splice(index, 1)
    await Bun.write(novelFilePath, JSON.stringify(novel))
    return 1
  } catch (err) {
    return { code: 500, msg: '写入错误', err: err.toString() }
  }
})

router.post('/link/update-item', async req => {
  const novel: any[] = await Bun.file(novelFilePath).json()
  const form = req.form
  if (!form.id) {
    return {
      code: 400,
      msg: '请传入 id',
    }
  }

  const index = novel.findIndex(fv => fv.id === form.id)
  if (index === -1) {
    return {
      code: 404,
      msg: '找不到 id:' + form.id,
    }
  }

  const item = novel[index]
  for (const key in form.data) {
    item[key] = form.data[key]
  }

  novel[index] = item

  try {
    await Bun.write(novelFilePath, JSON.stringify(novel))
    return 'ok'
  } catch (err) {
    return { code: 500, msg: '写入错误', err: err.toString() }
  }
})

export default router
