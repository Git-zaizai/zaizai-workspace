import { loadEnv } from 'vite'

export const getConfigEnv = (mode: string) => {
  const viteEnv = loadEnv(mode, process.cwd()) as unknown as ENV

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
