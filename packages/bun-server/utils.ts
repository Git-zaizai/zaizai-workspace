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
