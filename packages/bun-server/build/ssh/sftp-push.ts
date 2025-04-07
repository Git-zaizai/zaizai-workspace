import Client from 'ssh2-sftp-client'
import { NodeSSH } from 'node-ssh'
import ora from 'ora'
import path from 'path'
import fs from 'fs'
import dayjs from 'dayjs'

const { SSH_HOST, SSH_PORT, SSH_USER, SSH_PASSWORD, SSH_UPLOAD_PATH } = process.env


const sftpConfig = {
    host: SSH_HOST,
    username: SSH_USER,
    password: SSH_PASSWORD,
    port: SSH_PORT,
}
const ssh = new NodeSSH()
const sftp = new Client()
let spinner = null // 进度显示
let totalFileCount = 0 // 本地dist文件夹中总文件数量
let num = 0 // 已成功上传到远端服务器上的文件数量

// 要排除的文件或文件夹
const excludeFile = [
    'node_modules'
]

function obtainTheRequiredFiles() {
    const root = path.join(__dirname, '../../')
    const files = fs.readdirSync(root, { withFileTypes: true })
    const result = files.filter(file => !excludeFile.includes(file.name))
    for (const file of files) {
        if (excludeFile.includes(file.name)) {
            continue
        }
        if (file.isDirectory()) {
            const fileRecursive = fs.readdirSync(file.parentPath + file.name, {
                recursive: true, // 递归读取子文件夹
                withFileTypes: true, // 返回文件类型信息
                encoding: 'utf-8' // 指定编码方式
            })
            result.push(file, ...fileRecursive)
        } else {
            result.push(file)
        }
    }
    return result.length
}

async function main() {
    try {

        const files = fs.readdirSync(path.join(__dirname, '../../'), { withFileTypes: true })
        totalFileCount = files.length

        console.log('连接服务器')
        await ssh.connect({
            host: SSH_HOST,
            username: SSH_USER,
            password: SSH_PASSWORD,
        })

        await sftp.connect(sftpConfig)
        console.log('服务器连接成功')

        await ssh.execCommand(`pm2 stop all`)
        console.log('pm2 停止成功');

        spinner = ora('正在上传中...').start()// loading...

        const isPh = await sftp.exists(SSH_UPLOAD_PATH)
        if (!isPh) {
            await sftp.mkdir(SSH_UPLOAD_PATH, true) // 给远端服务器创建文件夹
        }

        sftp.on('upload', () => {
            num = num + 1 // 完成数量加1
            let progress = ((num / totalFileCount) * 100).toFixed(2) + '%' // 算一下进度
            spinner.text = '当前上传进度为:' + progress // loading
        });

        const root = path.join(__dirname, '../../../../')
        for (const file of files) {
            if (excludeFile.includes(file.name)) {
                continue
            }

            let remoteph = file.parentPath.replace(root, '')
            remoteph = remoteph.replace(/\\/g, '/')
            remoteph = SSH_UPLOAD_PATH + '/' + remoteph

            if (file.isFile()) {
                let localFilePath = path.join(file.parentPath, file.name) // 拼接路径
                // 使用 put 不会自动创建文件夹，所以需要手动创建文件夹
                const isPh = await sftp.exists(remoteph)
                if (!isPh) {
                    await sftp.mkdir(remoteph, true) // 给远端服务器创建文件夹
                }
                await sftp.put(localFilePath, remoteph + file.name) // 把文件丢到远端服务器
            } else if (file.isDirectory()) {

                let localFilePath = path.join(file.parentPath, file.name) // 拼接路径
                await sftp.uploadDir(localFilePath, remoteph + file.name) // 给远端服务器创建文件夹
            }
        }

        await ssh.execCommand(`pm2 start all`)
        console.log('\n 更新完成...')
    } catch (err) {
        console.log(err)
    } finally {
        sftp.end()
        spinner && spinner.info('自动化脚本执行结束')
        return 0
    }
}


export default main