import { Console } from 'node:console'
import { LOG_PATH } from '../config'
import path from 'node:path'
import fs from 'node:fs'
import dayjs from 'dayjs'
import { existsFile } from '../utils'
import type { ServerWebSocket } from 'bun'

export const logfile = path.join(LOG_PATH, '/ws/log.log')
export const errorfile = path.join(LOG_PATH, '/ws/error.log')

existsFile(logfile)
existsFile(errorfile)

export const logger = new Console({
  stdout: fs.createWriteStream(logfile),
  stderr: fs.createWriteStream(errorfile),
})

/**
 * @var {Map<string, { ws: RouteServerWebSocket, messages: any[], createDate: number }>} wsMap
 *
 */
export const wsMap = new Map<
  string,
  {
    ws: ServerWebSocket<{ socketId: string }>
    messages: any[]
    createDate: number
  }
>()

export const loggerAppend = msg => {
  const heartbeatfliePath = () => {
    const ph = path.join(LOG_PATH, '/ws/heart' + dayjs().format('YYYY-MM-DD') + '.txt')
    if (fs.existsSync(ph)) {
      return ph
    } else {
      fs.writeFileSync(ph, '心跳日志文件：\n')
      return ph
    }
  }
  const ph = heartbeatfliePath()
  let erri = 0
  const run = () => {
    try {
      fs.appendFileSync(ph, msg)
    } catch (err) {
      logger.error(`${dayjs().format('YYYY-MM-DD-HH-mm-ss')} 心跳日志文件写入失败`)
      ++erri
      if (erri < 3) {
        run()
      }
    }
  }
  run()
}
