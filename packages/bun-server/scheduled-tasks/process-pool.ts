import { spawn, type SpawnOptions } from 'child_process'
import os from 'os'
import { nanoid } from 'nanoid'

type tasksFun = (command: string) => Promise<{ code: number; type: string; msg: string; err?: Error; signal?: string }>
interface tasksItem {
  id: string
  fun: tasksFun
}

const tasks: tasksItem[] = []
const cpus = os.cpus().length

export const runTasks = async (command: string, taskFn: tasksFun) => {
  if (tasks.length >= cpus) return
  const id = nanoid()
  tasks.push({ id, fun: taskFn })
  taskFn(command)
    .catch((err: any) => {
      console.log(err)
    })
    .finally(() => {
      const index = tasks.findIndex(item => item.id === id)
      tasks.splice(index, 1)
    })
}

export const run = async (command: string, options: SpawnOptions) => {
  /**
   * stdio 通过数组形式分别控制子进程的 stdin（输入）、stdout（输出） 和 stderr（错误输出） 流的行为。每个数组元素可设置为以下值：
      'pipe'	创建管道（默认值），父进程可通过 child.stdin/child.stdout/child.stderr 读写数据
      'inherit'	子进程直接继承父进程的对应流（如控制台实时显示输出）18
      'ignore'	丢弃该流的数据（不处理输入/输出）29
      文件描述符	将流重定向到指定文件（如 fs.openSync() 返回的数值描述符）1
      'ipc'	创建 IPC 通道，用于父子进程间通信（需配合 send() 和 on('message') 使用）8
   */
  if (process.env.NODE_ENV === 'development') {
    options.stdio = 'inherit'
  } else {
    options.stdio = ['ignore', 'pipe', 'pipe']
  }
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      // cwd: process.cwd(),
      stdio: options.stdio,
      shell: process.platform === 'win32',
      ...options,
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', code => {
      process.removeListener('exit', onProcessExit)

      if (code === 0)
        resolve({
          code: 200,
          type: 'close',
          msg: '运行成功',
        })
      else
        reject({
          code,
          type: 'close',
          msg: `Command failed. \n Command: ${command} \n Code: ${code}`,
        })
    })
    app.on('error', (err: any) => {
      if (err.code === 'ETIMEDOUT') {
        console.error(' 子进程执行超时，已终止')
        return reject({
          code: 500,
          type: 'error',
          msg: `运行失败，执行超时 \n Command: ${command} \n msg: ${err.message}`,
          err,
        })
      }
      reject({
        code: 500,
        type: 'error',
        msg: `运行失败，启动失败 \n Command: ${command} \n msg: ${err.message}`,
        err,
      })
    })
    app.on('exit', (code, signal) => {
      if (code === 1) {
        reject({
          type: 'exit',
          msg: `运行失败，退出 \n Command: ${command} \n Code: ${code} \n signal: ${signal}`,
          code,
          signal,
        })
      }
    })
    process.on('exit', onProcessExit)
  })
}

import dayjs from 'dayjs'
import { appendFileSync } from 'node:fs'
import { type scheduledItem, getScheduledJson, setScheduledJson } from './router'

const appandLog = (logfile: string, str: string, error?: any) => {
  appendFileSync(logfile, `${dayjs().format('YYYY-MM-DD HH:mm:ss')} ${str} ${error ? JSON.stringify(error) : ''}\n`)
}

/**
 * 开始任务 并修改状态
 * @param item
 * @returns
 */
const startFun = async (item: scheduledItem) => {
  appandLog(item.logfile, `__startFun 开始运行`)
  try {
    const json = await getScheduledJson()
    const find = json.find(v => v.id === item.id)
    find.runDate = dayjs()
    find.conut = find.conut + 1
    find.status = 1
    setScheduledJson(json)
    return 1
  } catch (error) {
    appandLog(item.logfile, `__startFun 失败`, error)
  }
}

/**
 * 停止任务 并修改状态
 * @param item
 * @returns
 */
const stopFun = async (item: scheduledItem) => {
  appandLog(item.logfile, `__stopFun 开始运行`)
  try {
    const json = await getScheduledJson()
    const find = json.find(v => v.id === item.id)
    find.status = 0
    setScheduledJson(json)
    return 1
  } catch (error) {
    appandLog(item.logfile, `__stopFun 失败`, error)
  } finally {
    appandLog(item.logfile, `结束运行`)
  }
}

const runErrorFun = async (item: scheduledItem) => {
  try {
    const json = await getScheduledJson()
    const find = json.find(v => v.id === item.id)
    find.status = 2
    setScheduledJson(json)
    return 1
  } catch (error) {
    appandLog(item.logfile, `__stopFun 失败`, error)
  } finally {
    appandLog(item.logfile, `结束运行`)
  }
}

/**
 * @function 定时任务 使用闭包保存数据 然后在 任务执行 前后修改状态 log开始或结束
 * @param item
 * @returns
 */
export const createScheduledTask = (item: scheduledItem): [() => Promise<any>, () => void] => {
  let data = item
  // 重试次数
  let conut = 0
  let maxConut = 3

  const task = async () => {
    try {
      await startFun(data)
      const res = await run(data.executeCommand, {
        timeout: 1000 * 60 * 10,
      })
      await stopFun(data)
      return res
    } catch (error) {
      appandLog(data.logfile, ` id:${data.id}  title:${data.title} 定时任务出错`, error)
      conut++
      if (conut >= maxConut) {
        appandLog(data.logfile, `id:${data.id}  title:${data.title} 达到最大重试次数，停止重试`, error)
        runErrorFun(data)
        return error
      } else {
        appandLog(data.logfile, `重试第${conut}次`)
        return task()
      }
    }
  }

  const release = () => {
    data = null
    conut = null
    maxConut = null
  }
  return [task, release]
}
