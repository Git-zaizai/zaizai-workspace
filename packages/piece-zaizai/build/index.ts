import { loadEnv } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// 获取版本号new RegExp(`^(${envVarName}=).*$`, 'gm');
export const updateEnvFileVar = (mode: string, envVarNames: { envKey: string, value: string }[]) => {
	const envVarNameList = envVarNames.map((item) => ({ ...item, regex: new RegExp(`^(${item.envKey}\\s*=\\s*)(.*?)(\\s*(#|$))`, 'm') }))
	const envFileList = fs.readdirSync(process.cwd()).filter((item) => item.includes('.env')).filter((item) => item.includes(mode))
	envFileList.push('.env')
	envFileList.forEach(file => {
		const envPath = path.join(process.cwd(), file)
		let envFileStr = fs.readFileSync(envPath, 'utf-8').toString()
		envFileStr = envVarNameList.reduce((prev, curr) => {
			let newprev = prev.replace(curr.regex, `$1${curr.value}$3`)
			return newprev
		}, envFileStr)
		fs.writeFileSync(envPath, envFileStr)
	})
}

export const getVersion = () => {
	const packagePath = path.resolve(process.cwd(), 'package.json')
	const packageConfig = fs.readFileSync(packagePath, 'utf-8').toString()
	const packageJson = JSON.parse(packageConfig)
	const version = packageJson.version
	return { value: version, envKey: 'VITE_APP_VERSION' }
}

export const getConfigEnv = (mode: string) => {
	const viteEnv = loadEnv(mode, process.cwd()) as unknown as Env.ImportMeta

	for (const viteEnvKey in viteEnv) {
		if (viteEnv[viteEnvKey] === 'true') {
			viteEnv[viteEnvKey] = true
		} else if (viteEnv[viteEnvKey] === 'false') {
			viteEnv[viteEnvKey] = false
		}
	}

	viteEnv['BASE_URL'] = viteEnv['BASE_URL'] || '/'
	return viteEnv
}
