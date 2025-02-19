import path from 'path'

// @ts-ignore
export const DATA_PATH = path.join(import.meta.dirname, './data')
// @ts-ignore
export const LOG_PATH = path.join(import.meta.dirname, './logs')
// @ts-ignore
export const CACHE_PATH = path.join(import.meta.dirname, './cache')

export const CACHE_PATH_JSON = path.join(CACHE_PATH, 'json')
// @ts-ignore
export const UPLOAD_PATH = path.join(import.meta.dirname, './public/upload')

// 密钥
export const cert = 'ONE_PIECE_ZAIZAI'
