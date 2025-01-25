import { Console } from 'node:console'
import { LOG_PATH } from '../config'
import path from 'node:path'
import fs from 'node:fs'

export const logfile = path.join(LOG_PATH, '/ws/log.txt')
export const errorfile = path.join(LOG_PATH, '/ws/error.txt')
export const logger = new Console({
    stdout: fs.createWriteStream(logfile),
    stderr: fs.createWriteStream(errorfile)
})

export const wsMap = new Map()
