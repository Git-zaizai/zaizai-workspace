import fs from 'fs'
import path from 'path'
import { rimraf } from 'rimraf'

rimraf.sync(path.join(import.meta.dirname, '../dist/css'))

// 定义源文件夹和目标文件夹的路径
const sourceDir = path.join(import.meta.dirname, '../src/styles')
const targetDir = path.join(import.meta.dirname, '../dist/css')

// 确保目标文件夹存在，如果不存在则创建
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

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

// 调用复制函数
copyFolder(sourceDir, targetDir)

copyFolder(sourceDir, path.join(import.meta.dirname, '../public/css'))

console.log('CSS 文件已复制')
