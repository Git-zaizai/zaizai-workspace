import { Router } from '../plugins/router'
import { scheduledFileDataJSON, scheduledRunFilePath, scheduledRunLogPath } from '../config'
import { readdir } from 'node:fs/promises'
import path from 'path'
import { normalizePath, runShell, existsFile } from '../utils'
import nodeSchedule from 'node-schedule'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { createScheduledTask } from './process-pool'
import { writeHeaher } from './write-str'
import fs from 'fs'

// 匹配 1.1.1 版本
const regVersion = /\d+(?:\.\d+){2}/
const regRunFile = /.js|.ts/

const router = new Router()
/**
 * 任务列表
 * key: 任务id
 * value:{
 *  tasks: 任务函数
 *  release: 释放闭包内容回调函数
 * }
 */
export const tasksMap = new Map()

export type scheduledItem = ReturnType<typeof createScheduledData>

export const getScheduledJson = (): Promise<scheduledItem[]> => {
  try {
    return Bun.file(scheduledFileDataJSON).json()
  } catch (e) {
    console.log("=>(router.ts:34) e", e)
  }
}
export const setScheduledJson = (data: scheduledItem[]) => {
  return Bun.write(scheduledFileDataJSON, JSON.stringify(data))
}

const writeJsHeader = async (item: scheduledItem) => {
  try {
    let str = await Bun.file(item.runfile).text()
    if (str.indexOf(`import pino from 'pino'`) === -1) {
      str = writeHeaher(item) + str
      await Bun.write(item.runfile, str)
    }
    return true
  } catch (error) {
    console.log('写入头部失败', error)
    return false
  }
}

router.get('/scheduled-flie-list', async req => {
  const files = await readdir(scheduledRunFilePath)
  return files
    .filter(v => regRunFile.test(v))
    .map(v => {
      return normalizePath(path.join(scheduledRunFilePath, v))
    })
})

router.post('/scheduled-file-content', req => {
  const ph = req.form.ph
  if (!ph) {
    req.status = 400
    return '请传入正确文件名'
  }
  if (!fs.existsSync(ph)) {
    req.status = 400
    return '找不到文件'
  }
  return Bun.file(ph)
})

const createScheduledData = (obj: Record<string, any>) => {
  return Object.assign(
    {
      createUser: '',
      updateUser: '',
      title: '',
      runfile: '',
      cron: '',
      testcron: '',
      logfile: '',
      conut: 0,
      status: 0,
      executeCommand: '',
      switch: false,
    },
    obj,
    { id: nanoid(), runDate: dayjs(), createDate: dayjs(), updateDate: dayjs() }
  )
}
router.post('/scheduled-add', async req => {
  const form = req.form
  const token = req.mate.token
  if (!form.runfile) {
    req.status = 400
    return '请传入正确的运行文件'
  }

  if (!form.cron) {
    req.status = 400
    return '请传入cron表达式'
  }

  if (!form.executeCommand) {
    req.status = 400
    return '请传入运行命令'
  } else {
    form.executeCommand = path.normalize(form.executeCommand)
  }

  if (!form.logfile) {
    form.logfile = path.join(scheduledRunLogPath, form.runfile.split('/').pop().replace(regRunFile, '.log'))
  } else {
    if (!form.logfile.includes('/')) {
      form.logfile = path.join(scheduledRunLogPath, form.runfile.split('/').pop().replace(regRunFile, '.log'))
    }
  }

  form.runfile = path.normalize(form.runfile)

  let state = createScheduledData({
    createUser: token.code,
    updateUser: token.code,
    ...form,
  })

  try {
    const json = await getScheduledJson()

    if (json.some(it => it.cron === state.cron && it.runfile === state.runfile)) {
      req.status = 400
      return '同一时间，不能运用同一脚本'
    }

    let isJsHeader = await writeJsHeader(state)
    if (!isJsHeader) {
      req.status = 400
      return '修改js头部失败'
    }
    json.push(state)
    await setScheduledJson(json)
    return { data: state }
  } catch (err) {
    console.log(err)
    req.status = 500
    return '增加任务失败'
  }
})

router.post('/open-tasks', async req => {
  const form = req.form
  if (!form.id) {
    req.status = 400
    return '请输入 id'
  }

  try {
    const json = await getScheduledJson()
    const index = json.findIndex(v => v.id === form.id)
    const find = json[index]
    if (!find) {
      req.status = 400
      return `找不到 id:${form.id} 的任务`
    }
    let tasksMapitem = null
    if (tasksMap.has(tasksMapitem)) {
      req.status = 400
      return '任务已在运行，请先关闭'
    } else {
      tasksMapitem = {}
    }

    // 检查文件是否存在
    await existsFile(find.logfile)
    // 创建任务
    const [task, release] = createScheduledTask(find)
    const cron = process.env.NODE_ENV === 'development' ? find.testcron : find.cron
    const tasks = nodeSchedule.scheduleJob(cron, task)
    tasksMapitem.tasks = tasks
    tasksMapitem.release = release
    tasksMap.set(find.id, tasksMapitem)

    json.splice(index, 1, { ...find, switch: true })
    await setScheduledJson(json)


    return 'ok'
  } catch (error) {
    console.log(error)
    req.status = 500
    return '开启任务失败'
  }
})

router.post('/manual-start-tasks', async req => {
  try {
    const form = req.form
    if (!form.id) {
      req.status = 400
      return '请输入 id'
    }
    const json = await getScheduledJson()
    const find = json.find(it => it.id === form.id)
    if (!find) {
      req.status = 400
      return `找不到 id:${form.id} 的任务`
    }

    const [task, release] = createScheduledTask(find)
    let res = null
    res = await task().catch(err => {
      res = err
    })
    release()
    return { data: res }
  } catch (error) {
    console.log(error)
    req.status = 500
    return '路由 manual-start-tasks 失败'
  }
})

router.post('/stop-tasks', async req => {
  const form = req.form
  if (!form.id) {
    req.status = 400
    return '请输入 id'
  }

  const tasksMapitem = tasksMap.get(form.id)

  try {
    const json = await getScheduledJson()
    const find = json.find(it => it.id === form.id)
    find.switch = false

    if (!tasksMap.has(form.id)) {
      await setScheduledJson(json)
      return { code: 1, msg: '任务未开启' }
    }

    tasksMapitem.tasks.cancel()
    tasksMapitem.release()
    tasksMap.delete(form.id)
    await setScheduledJson(json)

    return 'ok'
  } catch (error) {
    console.log(error)
    req.status = 500
    return '停止任务失败'
  }
})

router.post('/deldet-tashks', async req => {
  const form = req.form
  if (!form.id) {
    req.status = 400
    return '请输入 id'
  }
  try {
    const json = await getScheduledJson()
    let tasksMapitem
    if (tasksMap.has(form.id)) {
      tasksMapitem = tasksMap.get(form.id)
      tasksMapitem.tasks.cancel()
      tasksMapitem.release()
      tasksMap.delete(form.id)
      tasksMapitem = null
    }
    const index = json.findIndex(it => it.id === form.id)
    json.splice(index, 1)
    await setScheduledJson(json)
    return 'ok'
  } catch (error) {
    console.log(error)
    req.status = 500
    return '删除任务失败'
  }
})

router.get('/runner', async () => {
  let res = []
  const all = (await Promise.all([
    runShell('bun --version').catch(() => {
      return ''
    }),
    runShell('volta list node').catch(() => {
      return ''
    }),
  ])) as string[]

  if (all[0] === '' && all[1] === '') {
    return ''
  }

  res.push(`Bun-${all[0].replace('\n', '')}`)

  all[1].split('\n').forEach(v => {
    let txt = v.replace('runtime', '').replace('@', '-').trim()
    if (txt) {
      res.push(txt)
    }
  })
  return res
})

router.post('/upload-runfile', async req => {
  const file = req.form.get('file')

  if (!file) {
    req.status = 400
    return '请选择文件'
  }
  if (!regRunFile.test(file.name)) {
    req.status = 400
    return '只能上传js或ts文件'
  }
  try {
    await Bun.write(path.join(scheduledRunFilePath, file.name), file)
    return 'ok'
  } catch (error) {
    console.log('上传失败', error)
    req.status = 500
    return '上传失败'
  }
})

router.post('/update-tasks', async req => {
  if (!req.form.id) {
    req.status = 400
    return '找不到任务'
  }

  if (req.form.switch) {
    req.status = 400
    return '请先关闭任务'
  }
  const form = req.form
  try {
    const json = await getScheduledJson()
    const index = json.findIndex(it => it.id === form.id)
    const find = json[index]
    if (find.switch) {
      req.status = 400
      return '请先关闭任务'
    }

    if (tasksMap.has(find.id)) {
      req.status = 400

      return '在map中有任务，请先关闭任务'
    }
    const newTashks = Object.assign(find, form)
    newTashks.updateDate = dayjs()
    json[index] = newTashks
    await setScheduledJson(json)
    return {
      data: newTashks,
    }
  } catch (error) {
    req.status = 500
    return '修改失败'
  }
})

// 查看是否有tasksMap中自动任务
router.get('/tashks-size', () => {
  return tasksMap.size.toString()
})

router.post('/saveFile', async req => {
  try {
    const form = req.form
    if (!form.ph) {
      req.status = 400
      return '请输入文件路径'
    }
    if (!form.content) {
      req.status = 400
      return '请输入文件内容'
    }
    if (!fs.existsSync(form.ph)) {
      req.status = 400
      return '找不到文件'
    }
    await Bun.write(form.ph, form.content)
    return 'ok'
  } catch (err) {
    console.log(err)
    req.status = 500
    return '保存文件失败'
  }
})

export default router
