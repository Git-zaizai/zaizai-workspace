import * as dotenv from 'dotenv'
const dotenvRes = dotenv.config({
  path: ['.evv', '.env.development', '.env.production'],
})

for (const key in dotenvRes) {
  process.env[key] = dotenvRes[key]
}
