import nodeSchedule from 'node-schedule'
import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import { readdirSync } from 'node:fs'
import { mkdirRecursive } from '../utils'
import dayjs from 'dayjs'

// 定义最大重试次数
const MAX_RETRIES = 3
const fileCpDate = process.env.NODE_ENV === 'development' ? '0 0/5 * * * ?' : '0 0 0 * * ?'

const retryTask = () => {}

const backupFiles = () => {
  let retries = 0
  let fileDir
  if (process.env.NODE_ENV === 'development') {
    fileDir = path.join(__dirname, '../www/cacheFile', dayjs().format('YYYY-MM-DD-HH-mm-ss'))
  } else {
    fileDir = '/www/cacheFile/' + dayjs().format('YYYY-MM-DD-HH-mm-ss')
  }

  mkdirRecursive(fileDir)

  fs.cp(path.join(__dirname, '../data/json'), fileDir, { recursive: true })
    .then(() => {
      console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} 备份成功`)
      retries = 0
    })
    .catch(err => {
      retries++
      console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} 备份失败`, err)

      if (retries < MAX_RETRIES) {
        console.log(`第 ${retries} 次重试`)
        retryTask()
        backupFiles()
      } else {
        console.log('达到最大重试次数，停止重试')
      }
    })
}

nodeSchedule.scheduleJob(fileCpDate, backupFiles)

console.log(`定时任务已启动`)
process.on('SIGINT', function () {
  nodeSchedule.gracefulShutdown().then(() => process.exit(0))
})
