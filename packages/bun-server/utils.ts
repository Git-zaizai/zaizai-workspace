import path from 'node:path'
import fs from 'node:fs'

export const wait = (time: number = 1000) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export function normalizePath(inputPath) {
  // 检测是否为 Windows 风格路径
  if (path.sep === '\\') {
    return inputPath.replace(/\\/g, '/')
  }
  return inputPath // 已经是 Unix/Linux 风格，无需转换
}

export async function existsFile(ph: string) {
  ph = normalizePath(ph)
  if (!fs.existsSync(ph)) {
    const phs = ph.split('/')
    phs.pop()
    if (path.sep === '/') {
      phs.unshift('/')
    }
    fs.mkdirSync(path.join(...phs), { recursive: true })
    return fs.writeFileSync(ph, '')
  }
}

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
    if (interfaceName === 'WLAN') {
      ifaces.push(interfaces[interfaceName][1].address)
    }
  }
  return ifaces
}
