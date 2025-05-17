import { run } from './run'
import fs from 'fs'
import path from 'path'

fs.readdirSync(path.join(__dirname, '../packages')).forEach(item => {
  let node_modules = path.join(__dirname, '../packages', item, 'node_modules')
  run(`rimraf ${node_modules}`)
    .then(() => {
      console.log(`${item} node_modules 删除完成`)
    })
    .catch(err => {
      console.log(`${item} node_modules 删除失败`)
    })
})
run(`rimraf ./node_modules`)
  .then(() => {
    console.log(`顶层 node_modules 删除完成`)
  })
  .catch(err => {
    console.log(`node_modules 删除失败`)
  })
