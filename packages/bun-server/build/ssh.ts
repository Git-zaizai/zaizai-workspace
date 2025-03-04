import { NodeSSH } from 'node-ssh'
import Client from 'ssh2-sftp-client'
// @ts-expect-error
import ora from 'ora'
import { execSync } from 'child_process'

import path from 'node:path'
import fs from 'node:fs'
import dayjs from 'dayjs'

const sshConfig = {
  host: '118.193.47.111',
  username: 'root',
  password: 'nbj123456',
}

const sftpConfig = {
  host: '118.193.47.111',
  username: 'root',
  password: 'nbj123456',
  port: '22',
}

const ssh = new NodeSSH()
const sftp = new Client()
let spinner = null // 进度显示
let totalFileCount = 0 // 本地dist文件夹中总文件数量
let num = 0 // 已成功上传到远端服务器上的文件数量
// @ts-ignore
const loacldist = path.join(import.meta.dirname, '../dist')

// 处理命令输出
function getDirectories(stdout): string[] {
  return stdout
    .split('\n') // 按行分割
    .filter(dir => dir) // 过滤空行
    .map(dir => dir.trim().replace(/\/$/, '')) // 去除路径末尾的斜杠
}

function handleDistFiles(list) {
  const currentDate = dayjs().format('YYYY-MM-DD')
  let arr = list.filter(fv => fv.includes(currentDate))
  if (arr.length === 0) {
    return `dist-${dayjs().format('YYYY-MM-DD')}-01`
  }
  const max = arr.map(mv => Number(mv.split('-').pop())).reduce((a, b) => a + b, 1)
  return `dist-${dayjs().format('YYYY-MM-DD')}-${max}`
}

// 统计本地dist文件夹中有多少个文件（用于计算文件上传进度）
function foldFileCount(folderPath) {
  let count = 0
  const files = fs.readdirSync(folderPath) // 读取文件夹
  for (const file of files) {
    // 遍历
    const filePath = path.join(folderPath, file)
    const stats = fs.statSync(filePath)
    if (stats.isFile()) {
      // 文件就+1
      count = count + 1
    } else if (stats.isDirectory()) {
      // 文件夹就递归加
      count = count + foldFileCount(filePath)
    }
  }
  return count
}

// 把本地打包好的dist递归上传到远端服务器
async function uploadFilesToRemote(localFolderPath, remoteFolderPath, sftp) {
  const files = fs.readdirSync(localFolderPath) // 读取文件夹
  for (const file of files) {
    // 遍历
    let localFilePath = path.join(localFolderPath, file) // 拼接路径
    let remoteFilePath = path.join(remoteFolderPath, file) // 拼接路径
    remoteFilePath = remoteFilePath.replace(/\\/g, '/') // 针对于lunix服务器，需要做正反斜杠的转换
    const stats = fs.statSync(localFilePath) // 获取文件夹文件信息
    if (stats.isFile()) {
      // 是文件
      await sftp.put(localFilePath, remoteFilePath) // 把文件丢到远端服务器
      num = num + 1 // 完成数量加1
      let progress = ((num / totalFileCount) * 100).toFixed(2) + '%' // 算一下进度
      spinner.text = '当前上传进度为:' + progress // loading
    } else if (stats.isDirectory()) {
      // 是文件夹
      await sftp.mkdir(remoteFilePath, true) // 给远端服务器创建文件夹
      await uploadFilesToRemote(localFilePath, remoteFilePath, sftp) // 递归调用
    }
  }
}

const main = async () => {
  console.log(`检查本地 dist 文件夹...`)
  if (!fs.existsSync(loacldist)) {
    console.log(`本地 dist 文件夹不存在`)
    return
  }
  if (fs.readdirSync(loacldist).length === 0) {
    console.log(`本地 dist 文件夹下为空`)
    return
  }
  console.log(`检查完成...`)
  console.log('连接服务器...')
  try {
    await ssh.connect(sshConfig)
  } catch (e) {
    console.log('连接服务器失败!  错误信息：')
    console.log(e)
    return
  }
  console.log(`ssh 连接服务器成功...`)
  console.log(`正在创建文件夹...`)

  const { stdout } = await ssh.execCommand(`ls /www/`)
  const www = getDirectories(stdout)
  if (!www.includes('piece-zaizai')) {
    await ssh.execCommand(`mkdir /www/piece-zaizai`)
  }
  // 动态创建部署文件夹
  // dist-2025-2-22-01
  // dist-今日时间-今天部署了几次
  // const mkderDist = await ssh.execCommand('ls /www/piece-zaizai')
  // const distList = getDirectories(mkderDist.stdout)
  // const currentFile = handleDistFiles(distList)
  // await ssh.execCommand(`mkdir /www/piece-zaizai/${currentFile}`)
  // console.log(`文件夹创建完成...`)

  console.log('连接服务器ftp...')
  try {
    await sftp.connect(sftpConfig)
    console.log('连接ftp完成...')
    console.log('正在删除 /dist/* 文件...')
    await sftp.rmdir(`/www/piece-zaizai/dist`, true)
    console.log('删除完成...')
    totalFileCount = foldFileCount(loacldist)
    spinner = ora('正在上传中...').start() // loading...
    // 耗时操作，递归上传文件
    await uploadFilesToRemote(loacldist, `/www/piece-zaizai/dist`, sftp)
  } catch (e) {
    console.log('连接ftp失败 错误:')
    console.log(e)
  } finally {
    sftp.end()
    ssh.dispose()
    spinner.info('上传完成...')
  }
}

const test = async () => {
  console.log('连接服务器...')
  try {
    await ssh.connect({
      host: '192.168.238.128',
      username: 'root',
      password: '123456',
    })
  } catch (e) {
    console.log('连接服务器失败!  错误信息：')
    console.log(e)
    return
  }
  console.log(`ssh 连接服务器成功...`)

  // 检查目录是否存在，若不存在则创建
  const checkDirCommand = `if [ ! -d "/www/zaizai-workspace" ]; then mkdir -p /www/zaizai-workspace; fi`
  await ssh.execCommand(checkDirCommand)
  // 检查是否为 Git 仓库，若不是则克隆仓库（这里假设仓库地址为示例地址，需替换为实际地址）
  const checkGitRepoCommand = `if [ ! -d "/www/zaizai-workspace/.git" ]; then cd /www/zaizai-workspace && git clone <your-repo-url> .; fi`
  await ssh.execCommand(checkGitRepoCommand)

  // 执行 git pull 命令
  const { stdout, stderr } = await ssh.execCommand(`cd  /www/zaizai-workspace && git pull`)

  if (stdout) {
    // @ts-ignore
    const localCommitHash = execSync(`git -C ${import.meta.dir} rev-parse HEAD`)
      .toString()
      .trim()
    const ubuntuCommitHash = stdout
      .split('\n')
      .shift()
      .replace(/[\u4e00-\u9fa5]/g, '')
      .split('..')
    const eveny = ubuntuCommitHash.every(v => localCommitHash.includes(v))
    console.log("🚀 ~ test ~ localCommitHash:", localCommitHash)
    console.log("🚀 ~ test ~ ubuntuCommitHash:", ubuntuCommitHash)
    if (eveny) {
      console.log('代码已经是最新的了')
      return
    } else {
      console.log('代码不是最新的')
    }
  } else {
    console.log('执行 git pull 命令失败')
  }

  ssh.dispose()
}

test()
