import jsonwebtoken from 'jsonwebtoken'
import { cert } from '../config'

// 测试使用
export const USER_DATA = [
  {
    name: 'ONE_PIECE_ZAIZAI',
    pwd: 'zaizai',
  },
  {
    name: 'root',
    pwd: 'ONE_PIECE_ZAIZAI',
  },
  {
    name: '10086',
    pwd: '10086',
  },
]

export const getUserinfo = pwd => {
  return USER_DATA.find(item => item.pwd === pwd)
}

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

export function jwtVerify(token: string) {
  let resp = { code: 200, data: null, msg: '', root: false }
  try {
    const user = jsonwebtoken.verify(token, cert, {
      issuer: 'zaizai',
      algorithms: ['HS384'],
    })
    resp.data = user
    resp.root = user.name === '10086' ? false : true
  } catch (e) {
    resp.code = 401
    if (e.name === 'TokenExpiredError') {
      resp.msg = '令牌已过期'
    } else if (e.name === 'JsonWebTokenError') {
      resp.msg = '令牌无效'
    } else if (e.name === 'NotBeforeError') {
      resp.msg = '令牌尚未生效'
    } else {
      resp.msg = '未知错误，请重新获取'
    }
  }
  return resp
}
