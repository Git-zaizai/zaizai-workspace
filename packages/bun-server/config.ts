import path from 'path'

const { ZAI_DATA_PATH, ZAI_LOGS_PATH, NODE_ENV } = process.env
// 数据保存路径
// @ts-ignore
export const DATA_PATH = NODE_ENV === 'development' ? path.join(import.meta.dirname, './www/data') : path.join(ZAI_DATA_PATH, 'data')
// 日志保存路径
// @ts-ignore
export const LOG_PATH = NODE_ENV === 'development' ? path.join(__dirname, './www/ws-logs') : path.join(ZAI_LOGS_PATH, '/ws-logs')
// 缓存路径文件   放一些重要的缓存
// @ts-ignore
export const CACHE_PATH = path.join(import.meta.dirname, './cache')
// json文件保存路径  放一些不重要的东西
// @ts-ignore
export const CACHE_PATH_JSON = path.join(import.meta.dirname, 'json')
// 上传文件保存路径
// @ts-ignore
export const UPLOAD_PATH = NODE_ENV === 'development' ? path.join(__dirname, './www/upload') : path.join(ZAI_DATA_PATH, 'upload')
// 定时任务执行文件保存路径
export const scheduledRunFilePath = path.join(__dirname, './scheduled-file')
// 定时任务数据文件保存路径
export const scheduledFileDataJSON = path.join(DATA_PATH, './json/scheduled-file.json')
// 定时任务日志文件存放文件夹
export const scheduledRunLogPath = NODE_ENV === 'development' ? path.join(__dirname, './www/scheduled-logs') : path.join(ZAI_LOGS_PATH, '/scheduled-logs')
// 备份文件地址
export const backupAddressPath = NODE_ENV === 'development' ? path.join(__dirname, './www/backupAddress') : path.join('/www/backupAddress')
// 最大请求体大小 默认 2gb
export const maxRequestBodySize = process.env.ZAI_maxRequestBodySize.replace('mb', '') ? 2 * 1024 * 1024 * 1024 : Number(process.env.ZAI_maxRequestBodySize.replace('mb', '')) * 1024 * 1024
// 加密密钥
export const cert = 'ONE_PIECE_ZAIZAI'
