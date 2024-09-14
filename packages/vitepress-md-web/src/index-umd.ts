import type { MarkdownEnv } from './shared/shared'

export const getEvn = (): MarkdownEnv => {
  const env: MarkdownEnv = {
    path: '/',
    relativePath: '/',
    cleanUrls: true,
    includes: ['/'],
    realPath: '/',
    localeIndex: '/',
  }
  return env
}

export { createMarkdownRenderer } from './markdown/markdown-web'
