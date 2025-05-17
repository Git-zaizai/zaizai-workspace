/* 
 // 去除dotenv Bun本身自带变量读取
 import * as dotenv from 'dotenv'
 const dotenvRes = dotenv.config({
 path: ['.env', '.env.development', '.env.production'],
 })

 for (const key in dotenvRes) {
 process.env[key] = dotenvRes[key]
 }
 */
import {
  DATA_PATH,
  LOG_PATH,
  UPLOAD_PATH,
  scheduledRunFilePath,
  scheduledRunLogPath,
  backupAddressPath,
} from './config.ts'
import { existsFile, mkdirRecursive } from './utils'

import './scheduled-tasks/console'

// 启动创建必要的文件夹
mkdirRecursive(DATA_PATH)
mkdirRecursive(LOG_PATH)
mkdirRecursive(UPLOAD_PATH)
mkdirRecursive(scheduledRunFilePath)
mkdirRecursive(scheduledRunLogPath)
mkdirRecursive(backupAddressPath)