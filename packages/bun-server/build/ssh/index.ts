import inquirer from 'inquirer'
import gitPush from './git-push.ts'
import sftpPush from './sftp-push.ts'

const questions = [
    {
        type: 'input',
        name: 'choice',
        message: '请选择操作:\n1、使用git更新\n2、使用sftp更新\n3、退出\n'
    }
]

async function main() {
    // @ts-ignore
    const { choice } = await inquirer.prompt(questions)
    if (choice == '1') {
        console.log('使用git更新')
        await gitPush()
    } else if (choice == '2') {
        console.log('使用sftp更新')
        await sftpPush()
    } else if (choice == '3') {
        console.log('退出')
        return
    }
    return main()
}
main()