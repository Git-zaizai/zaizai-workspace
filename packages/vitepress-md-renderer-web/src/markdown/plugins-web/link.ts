// markdown-it plugin for:
// 1. adding target="_blank" to external links
// 2. normalize internal links to end with `.html`

/**
 * 转换链接使用  在vitepress中，将外部链接的target设置为_blank，内部链接转换为.html
 *
 *
 */

import type MarkdownIt from 'markdown-it'
// import { URL } from 'url'
import { EXTERNAL_URL_RE, isExternal, type MarkdownEnv } from '../../shared/shared-web'

export const linkPlugin = (md: MarkdownIt, externalAttrs: Record<string, string>, base: string) => {
  md.renderer.rules.link_open = (tokens, idx, options, env: MarkdownEnv, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    const targetIndex = token.attrIndex('target')
    const downloadIndex = token.attrIndex('download')

    if (hrefIndex >= 0 && targetIndex < 0 && downloadIndex < 0) {
      const hrefAttr = token.attrs![hrefIndex]
      const url = hrefAttr[1]
      if (isExternal(url)) {
        Object.entries(externalAttrs).forEach(([key, val]) => {
          token.attrSet(key, val)
        })
        // catch localhost links as dead link
        if (url.replace(EXTERNAL_URL_RE, '').startsWith('//localhost:')) {
          pushLink(url, env)
        }
        hrefAttr[1] = url
      }
      pushLink(url, env)
    } else {
      pushLink(token.attrs![hrefIndex][0], env)
    }

    return self.renderToken(tokens, idx, options)
  }

  function pushLink(link: string, env: MarkdownEnv) {
    const links = env.links || (env.links = [])
    links.push(link)
  }
}
