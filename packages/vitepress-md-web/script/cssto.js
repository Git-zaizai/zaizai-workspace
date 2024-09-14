import fs from 'fs'
import path from 'path'

const csss = ['VPDocView.css', 'index.css']

const mian = () => {
  let pathDist = path.join(import.meta.dirname, '../dist')

  for (const css of csss) {
    let cssph = path.join(pathDist, css)

    if (!fs.existsSync(cssph)) {
      console.log(`${cssph} 文件不存在`)
      continue
    }

    let cssContent = fs.readFileSync(cssph, 'utf-8').toString()

    // 正则表达式匹配 @import url()
    const importRegex = /@import url\('(.*?)'\);/g

    let match
    const imports = []

    // 提取所有 @import 语句
    while ((match = importRegex.exec(cssContent)) !== null) {
      imports.push(match[0])
    }

    // 删除原始位置的 @import 语句
    const finalContent = cssContent.replace(importRegex, '')

    // 将提取的 @import 语句添加到文件顶部
    const newContent = imports.join('\n') + '\n\n' + finalContent

    // 写回文件
    fs.writeFileSync(path.join(pathDist, 'index.css'), newContent, 'utf8')
  }

  console.log('\n\n 处理 css 文件完成')
}

mian()
