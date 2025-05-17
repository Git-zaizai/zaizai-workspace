import path from 'node:path'
import fs from 'node:fs'

// 等待
export const wait = (time: number = 1000) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

// 将路径转换为 Unix/Linux 风格路径
export function normalizePath(inputPath) {
  // 检测是否为 Windows 风格路径
  if (path.sep === '\\') {
    return inputPath.replace(/\\/g, '/')
  }
  return inputPath // 已经是 Unix/Linux 风格，无需转换
}

// 将路径转换为 Windows 风格路径
export function pathConversion(inputPath) {
  // 检测是否为 Windows 风格路径
  if (path.sep === '\\') {
    return inputPath.replace(/\//g, '\\')
  }
  return path.join(inputPath)
}

// 判断文件是否存在，不存在则创建
export async function existsFile(ph: string) {
  ph = normalizePath(ph)

  if (!fs.existsSync(ph)) {
    const phs = ph.split('/')
    phs.pop()
    if (path.sep === '/') {
      phs.unshift('/')
    }
    fs.mkdirSync(path.join(...phs), { recursive: true })
    if (ph.includes('.json')) {
      fs.writeFileSync(ph, '[]')
    } else {
      fs.writeFileSync(ph, '')
    }
  }
}

// 递归创建文件夹
export function mkdirRecursive(ph: string) {
  if (!fs.existsSync(ph)) {
    fs.mkdirSync(ph, { recursive: true })
  }
}

import os from 'node:os'

export function getLocalIP() {
  const ifaces = []
  const interfaces = os.networkInterfaces()
  for (const interfaceName in interfaces) {
    let item = interfaces[interfaceName]
    if (interfaceName === 'WLAN') {
      if (item.length === 2) {
        // @ts-ignore
        item = item.find(i => i.family === 'IPv4')
        // @ts-ignore
        item && ifaces.push(item.address)
      } else {
        ifaces.push(item[0].address)
      }
    }
  }
  return ifaces
}

import { spawn, type SpawnOptions } from 'child_process'

export type runShellOptions = SpawnOptions & {
  resData?: boolean
}
// stdio: 忽略输入，捕获输出和错误
export const runShell = async (command, options: runShellOptions = { resData: true }): Promise<string | Error> => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd: options.cwd || process.cwd(),
      stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      ...options,
    })
    let resData = ''
    if (options.resData) {
      app.stdout.on('data', data => {
        resData += data.toString()
      })
    }

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', code => {
      process.removeListener('exit', onProcessExit)
      if (code === 0) resolve(resData)
      else reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`))
    })
    app.on('error', err => {
      reject(err)
    })
    process.on('exit', onProcessExit)
  })
}


export const readFileBlob = (ph: string) => {
  if (!fs.existsSync(ph)) {
    return '文件不存在'
  }
  return Bun.file(ph)
}