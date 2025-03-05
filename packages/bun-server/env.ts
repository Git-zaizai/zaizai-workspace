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