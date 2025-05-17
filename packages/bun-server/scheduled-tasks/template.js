process.env.NODE_ENV = 'production'
import pino from 'pino'
const __CONFIG = '#__config__#'
/*
// 测试使用
const __CONFIG = {
  id: '1',
  createUser: 'zaizai',
  updateUser: 'zaizai',
  title: 'title',
  runfile: 'runfile.js',
  cron: '0 0/10 * * * ?',
  logfile: 'runfile.log',
  conut: 0,
  status: 0,
  runDate: '2023-07-25T14:26:45.544Z',
  switch: false,
  switchLoading: false,
  createDate: '2023-07-25T14:26:45.544Z',
  updateDate: '2023-07-25T14:26:45.544Z',
} */
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
