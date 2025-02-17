import path from 'node:path'
import fs from 'node:fs'

export const wait = (time: number = 1000) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

import jsonwebtoken from 'jsonwebtoken'
import { cert } from './config'

export function jwtSign(data = {}, opts) {
  const options = Object.assign(
    {
      algorithm: 'HS384',
      expiresIn: '72h',
      issuer: 'zaizai',
    },
    opts
  )
  return jsonwebtoken.sign(data, cert, options)
}

export function jwtVerify(token) {
  return jsonwebtoken.verify(token, cert, {
    issuer: 'zaizai',
    algorithms: ['HS384'],
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