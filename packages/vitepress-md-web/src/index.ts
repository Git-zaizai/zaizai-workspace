import { createMarkdownRenderer } from './markdown/markdown'
import type { MarkdownEnv } from './shared/shared'

export const createMdRender = async () => {
  const env: MarkdownEnv = {
    path: '/',
    relativePath: '/',
    cleanUrls: true,
    includes: ['/'],
    realPath: '/',
    localeIndex: '/',
  }
  const md = await createMarkdownRenderer(
    '/',
    {
      attrs: {
        disable: false,
      },
      gfmAlerts: true,
      headers: true,
      math: true,
    },
    '/'
  )
  return {
    md,
    env,
  }
}
