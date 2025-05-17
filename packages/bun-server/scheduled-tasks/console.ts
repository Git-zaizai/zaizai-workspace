import { mkdirRecursive, existsFile } from '../utils'
import { scheduledFileDataJSON, scheduledRunLogPath } from '../config'
import { tasksMap, getScheduledJson, setScheduledJson } from './router'
import { createScheduledTask } from './process-pool'
import nodeSchedule from 'node-schedule'

// 监听应用关闭，修改自动任务状态
process.on('exit', async () => {
  const json = await getScheduledJson()
  if (json.length > 0) {
    json.forEach(it => it.switch = false)
    await setScheduledJson(json)
    console.log('应用关闭，修改任务状态')
  }
})

// 开机启动意外关闭，但是状态没有改变的任务
const startSchedule = async () => {
  const json = await getScheduledJson()
  if (json.length > 0) {
    for (let i = 0; i < json.length; i++) {
      const find = json[i]
      if (find.status) continue
      if (tasksMap.has(find.id)) continue
      const [task, release] = createScheduledTask(find)
      const cron = process.env.NODE_ENV === 'development' ? find.testcron : find.cron
      const tasks = nodeSchedule.scheduleJob(cron, task)
      const tasksMapitem = { tasks, release }
      tasksMap.set(find.id, tasksMapitem)
      console.log(`自动任务启动，id：${ find.id } title: ${ find.title }`)
      find.switch = true
    }
    await setScheduledJson(json)

    if (tasksMap.size > 0) {
      console.log(`开机启动自动任务`)
    } else {
      console.log('有任务，但是关闭状态')
    }
  } else {
    console.log('无自动任务')
  }
}

(async () => {
  mkdirRecursive(scheduledRunLogPath)
  await existsFile(scheduledFileDataJSON)
  startSchedule()
})()