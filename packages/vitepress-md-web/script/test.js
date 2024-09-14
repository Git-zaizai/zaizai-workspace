import fs from 'node:fs'
import path from 'node:path'
import { rimraf } from 'rimraf'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(import.meta.url)
const r = p => path.resolve(ROOT, '..', p)

fs.readdirSync(r('../dist')).forEach(v => {
  if (v.includes('tsbuildinfo')) {
    rimraf.sync(r('../dist/'))
  }
})
