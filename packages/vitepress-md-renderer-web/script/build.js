import fs from 'fs-extra'
import path from 'node:path'
import { rimraf } from 'rimraf'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(import.meta.url)
const r = p => path.resolve(ROOT, '..', p)

const mian = () => {
  // if (fs.existsSync(r('../dist/esm'))) {
  //   fs.copySync(r('../src/fonts'), r('../dist/esm/fonts'))
  // }
  fs.copySync(r('../src/fonts'), r('../dist/fonts'))

  if (fs.existsSync(r('../dist/umd'))) {
    fs.copySync(r('../src/styles'), r('../dist/umd/css'))
  }

  if (fs.existsSync(r('../dist/types'))) {
    rimraf.sync(r('../dist/types/markdown/plugins'))
    rimraf.sync(r('../dist/types/markdown/markdown.d.ts'))
    rimraf.sync(r('../dist/types/index-umd.d.ts'))
    rimraf.sync(r('../dist/types/index.d.ts'))
    rimraf.sync(r('../dist/types/shared/shared.d.ts'))

    fs.renameSync(r('../dist/types/index-web.d.ts'), r('../dist/types/index.d.ts'))
  }
}

mian()
