import Client from 'ssh2-sftp-client'
import { NodeSSH } from 'node-ssh'
import ora from 'ora'
import path from 'path'
import fs from 'fs'
import dayjs from 'dayjs'
import { normalizePath } from '../../utils'

const { SSH_HOST, SSH_PORT, SSH_USER, SSH_PASSWORD, SSH_UPLOAD_PATH } = process.env

const sftpConfig = {
  host: SSH_HOST,
  username: SSH_USER,
  password: SSH_PASSWORD,
  port: SSH_PORT,
}

const ssh = new NodeSSH()
const sftp = new Client()

// 要排除的文件或文件夹
const excludeFile = ['.idea', '.vscode', '.git/', 'node_modules', 'dist', 'bun-fastify', 'piece-zaizai', 'vitepress-md-renderer-web', 'upload/', 'data/json/', '/www']
const isEcludeFile = (filePath) => {
  let ph = normalizePath(filePath)
  return excludeFile.some(exclude => ph.includes(exclude))
}

let spinner = null // 进度显示
let totalFileCount = 0 // 要上传总文件数量
let num = 0 // 已成功上传到远端服务器上的文件数量

let uploadFileList = [] // 要上传的文件列表

function recursivelyObtainFiles(ph) {
  const files = fs.readdirSync(ph)
  for (const file of files) {
    const filePath = path.join(ph, file)
    if (isEcludeFile(filePath)) {
      continue
    }
    const stats = fs.statSync(filePath)
    if (stats.isFile()) {
      uploadFileList.push(filePath)
    } else if (stats.isDirectory()) {
      recursivelyObtainFiles(filePath)
    }
  }
}

async function main() {
  try {
    // 由于项目是 monorepo 结构，所以要上传顶层 文件
    const zaizaiPath = path.join(__dirname, '../../../../../zaizai-workspace')
    fs.readdirSync(zaizaiPath).forEach(file => {
      const filePath = path.join(zaizaiPath, file)
      if (!isEcludeFile(filePath)) {
        uploadFileList.push(filePath)
      }
    })

    const bunServerPath = path.join(__dirname, '../../')
    recursivelyObtainFiles(bunServerPath)

    console.log('开始连接服务器...')
    await ssh.connect({
      host: SSH_HOST,
      username: SSH_USER,
      password: SSH_PASSWORD,
    })
    await sftp.connect(sftpConfig)
    console.log('服务器连接成功')

    await ssh.execCommand(`pm2 stop all`)
    console.log('pm2 停止成功')


    totalFileCount = uploadFileList.length
    console.log(`\n 开始上传 ${totalFileCount} 个文件...`)
    spinner = ora('正在上传中...').start() // loading...

    for (const uploadFile of uploadFileList) {
      let remoteFilePath = uploadFile.replace(zaizaiPath, SSH_UPLOAD_PATH)
      remoteFilePath = normalizePath(remoteFilePath)
      let remoteFolderPath = remoteFilePath.split('/')
      remoteFolderPath.pop()
      remoteFolderPath = remoteFolderPath.join('/')
      const isPh = await sftp.exists(remoteFolderPath)
      if (!isPh) {
        await sftp.mkdir(remoteFolderPath, true) // 给远端服务器创建文件夹
      }
      const stats = fs.statSync(uploadFile)
      if (stats.isFile()) {
        await sftp.put(uploadFile, remoteFilePath) // 把文件丢到远端服务器
      } else if (stats.isDirectory()) {
        await sftp.mkdir(remoteFilePath, true) // 给远端服务器创建文件夹
      }
      num = num + 1 // 完成数量加1
      let progress = ((num / totalFileCount) * 100).toFixed(2) + '%' // 算一下进度
      spinner.text = '当前上传进度为:' + progress // loading
    }

    console.log('\n 上传完成...')

    console.log('启动 pm2...');
    await ssh.execCommand(`pm2 start all`)
    console.log('pm2 启动成功')
  } catch (err) {
    console.log(err)
  } finally {
    sftp.end()
    spinner && spinner.info('自动化脚本执行结束')
    return 0
  }
}

export default main