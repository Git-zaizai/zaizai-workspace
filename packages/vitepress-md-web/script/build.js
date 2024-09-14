import fs from 'node:fs'
import path from 'node:path'
import { rimraf } from 'rimraf'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(import.meta.url)
const r = p => path.resolve(ROOT, '..', p)

// 复制文件夹函数
function copyFolder(source, target) {
  // 确保目标文件夹存在
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }

  // 获取源文件夹的内容
  const files = fs.readdirSync(source)

  for (let file of files) {
    const sourceFile = path.join(source, file)
    const targetFile = path.join(target, file)

    // 检查是文件还是文件夹
    if (fs.statSync(sourceFile).isDirectory()) {
      // 如果是文件夹，则递归复制
      copyFolder(sourceFile, targetFile)
    } else {
      // 如果是文件，则直接复制
      fs.copyFileSync(sourceFile, targetFile)
    }
  }
}

const main = () => {
  const csss = r('../src/styles')
  const fons = r('../src/fonts')

  // copyFolder(csss, r('../dist/esm/css'))
  copyFolder(fons, r('../dist/esm/fons'))
  // const vueComponents = r('../src/VPDocView')
  // copyFolder(vueComponents, r('../dist/esm/components'))
  // rimraf.sync(r('../dist/esm/css/index.css'))
  fs.copyFileSync(r('../src/index.web.d.ts'), r('../dist/esm/index.d.ts'))

  if (fs.existsSync(r('../dist/umd'))) {
    const dist_umd = r('../dist/umd/css')
    copyFolder(csss, dist_umd)
    copyFolder(fons, r('../dist/umd/fonts'))
  }

  /*   fs.writeFileSync(
    r('../dist/esm/css/index.css'),
    `@import url('./fonts.css');
@import url('./vars.css');
@import url('./icons.css');
@import url('./base.css');
@import url('./utils.css');
@import url('./components/custom-block.css');
@import url('./components/vp-code-group.css');
@import url('./components/vp-code.css');
@import url('./components/vp-doc.css');
@import url('./components/vp-sponsor.css');`
  ) */
}

main()
