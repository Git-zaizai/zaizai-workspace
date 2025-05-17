import path from 'path'
import fs from 'fs/promises'
import { mkdirRecursive } from '../utils'
import dayjs from 'dayjs'

const main = () => {
    let filePath
    let fileDir
    
    if (process.env.NODE_ENV === 'development') {
        fileDir = path.join(__dirname, '../www/backupAddress', dayjs().format('YYYY-MM-DD-HH-mm-ss'))
        filePath = path.join(__dirname, '../www/data')
    } else {
        fileDir = '/www/backupAddress/' + dayjs().format('YYYY-MM-DD-HH-mm-ss')
        filePath = '/www/data/data'
    }
    mkdirRecursive(fileDir)
    fs.cp(filePath, fileDir, { recursive: true })
        .then(() => {
            console.log(`备份成功`)
        })
        .catch(err => {
            console.log(`备份失败`, err)
        })
}

main()