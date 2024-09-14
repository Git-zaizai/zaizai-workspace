import type { MarkdownEnv } from './shared/shared-web'

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

export { default as VPDocView } from './VPDocView/VPDocView.vue'
