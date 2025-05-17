export const writeHeaher = (config) => {
  const replaceList = [`'#__config__#'`]
  let str = `process.env.NODE_ENV = 'production'
import pino from 'pino'
const __CONFIG = '#__config__#'
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino/file',
    options: {
      destination: __CONFIG.logfile,
    },
  },
})
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
}
console.log = (...args) => {
  originalConsole.log(...args)
  logger.info(...args)
}
console.info = (...args) => {
  originalConsole.info(...args)
  logger.info(...args)
}
console.warn = (...args) => {
  originalConsole.warn(...args)
  logger.warn(...args)
}
console.error = (...args) => {
  originalConsole.error(...args)
  logger.error(...args)
}
/******************************************************************************* */
/******************************************************************************* */
/******************************************************************************* */
/******************************************************************************* */

`
  let configstr = JSON.stringify(config)
  configstr = configstr.replace(/,/g, ',\n')
  str = str.replace(replaceList[0], configstr + '\n')

  return str
}
