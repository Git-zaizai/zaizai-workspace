import { spawn } from 'child_process'

export const run = async (command, cwd) =>
  new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', code => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`))
    })
    process.on('exit', onProcessExit)
  })
