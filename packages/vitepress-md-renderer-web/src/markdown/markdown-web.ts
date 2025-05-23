import type { BuiltinTheme, Highlighter, LanguageInput, ShikiTransformer, ThemeRegistrationAny } from 'shiki'
import type { Options } from 'markdown-it'

import { headersPlugin, type HeadersPluginOptions } from '@mdit-vue/plugin-headers'
import { titlePlugin } from '@mdit-vue/plugin-title'
import { tocPlugin, type TocPluginOptions } from '@mdit-vue/plugin-toc'
import { slugify } from '@mdit-vue/shared'

import MarkdownIt from 'markdown-it'
import anchorPlugin from 'markdown-it-anchor'
import attrsPlugin from 'markdown-it-attrs'

import { full as emojiPlugin } from 'markdown-it-emoji'

import { containerPlugin, type ContainerOptions } from './plugins-web/containers'
import { gitHubAlertsPlugin } from './plugins-web/githubAlerts'
import { highlight } from './plugins-web/highlight-bundle-web'
import { highlightLinePlugin } from './plugins-web/highlightLines'
import { imagePlugin, type Options as ImageOptions } from './plugins-web/image'
import { lineNumberPlugin } from './plugins-web/lineNumbers'
import { linkPlugin } from './plugins-web/link'
import { preWrapperPlugin } from './plugins-web/preWrapper'
import { restoreEntities } from './plugins-web/restoreEntities'

import { highlightHeader } from './plugins-web/highlight-header'

export type { Header } from '../shared/shared-web'

export type ThemeOptions =
  | ThemeRegistrationAny
  | BuiltinTheme
  | {
    light: ThemeRegistrationAny | BuiltinTheme
    dark: ThemeRegistrationAny | BuiltinTheme
  }

export interface MarkdownOptions extends Options {
  /* ==================== General Options ==================== */

  /**
   * Setup markdown-it instance before applying plugins
   */
  preConfig?: (md: MarkdownIt) => void
  /**
   * Setup markdown-it instance
   */
  config?: (md: MarkdownIt) => void

  externalLinks?: Record<string, string>

  /* ==================== Syntax Highlighting ==================== */

  /**
   * Custom theme for syntax highlighting.
   *
   * You can also pass an object with `light` and `dark` themes to support dual themes.
   *
   * @example { theme: 'github-dark' }
   * @example { theme: { light: 'github-light', dark: 'github-dark' } }
   *
   * You can use an existing theme.
   * @see https://shiki.style/themes
   * Or add your own theme.
   * @see https://shiki.style/guide/load-theme
   */
  theme?: ThemeOptions
  /**
   * Languages for syntax highlighting.
   * @see https://shiki.style/languages
   */
  // languages?: LanguageInput[]
  languages?: string[]
  /**
   * Custom language aliases.
   *
   * @example { 'my-lang': 'js' }
   * @see https://shiki.style/guide/load-lang#custom-language-aliases
   */
  languageAlias?: Record<string, string>
  /**
   * Show line numbers in code blocks
   * @default false
   */
  lineNumbers?: boolean
  /**
   * Fallback language when the specified language is not available.
   */
  defaultHighlightLang?: string
  /**
   * Transformers applied to code blocks
   * @see https://shiki.style/guide/transformers
   */
  codeTransformers?: ShikiTransformer[]
  /**
   * Setup Shiki instance
   */
  shikiSetup?: (shiki: Highlighter) => void | Promise<void>
  /**
   * The tooltip text for the copy button in code blocks
   * @default 'Copy Code'
   */
  codeCopyButtonTitle?: string

  /* ==================== Markdown It Plugins ==================== */

  /**
   * Options for `markdown-it-anchor`
   * @see https://github.com/valeriangalliat/markdown-it-anchor
   */
  anchor?: anchorPlugin.AnchorOptions
  /**
   * Options for `markdown-it-attrs`
   * @see https://github.com/arve0/markdown-it-attrs
   */
  attrs?: {
    leftDelimiter?: string
    rightDelimiter?: string
    allowedAttributes?: Array<string | RegExp>
    disable?: boolean
  }
  /**
   * Options for `markdown-it-emoji`
   * @see https://github.com/markdown-it/markdown-it-emoji
   */
  emoji?: {
    defs?: Record<string, string>
    enabled?: string[]
    shortcuts?: Record<string, string | string[]>
  }
  /**
   * Options for `@mdit-vue/plugin-frontmatter`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-frontmatter
   */
  // frontmatter?: FrontmatterPluginOptions
  /**
   * Options for `@mdit-vue/plugin-headers`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-headers
   */
  headers?: HeadersPluginOptions | boolean
  /**
   * Options for `@mdit-vue/plugin-sfc`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-sfc
   */
  // sfc?: SfcPluginOptions
  /**
   * Options for `@mdit-vue/plugin-toc`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-toc
   */
  toc?: TocPluginOptions
  /**
   * Options for `@mdit-vue/plugin-component`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-component
   */
  // component?: ComponentPluginOptions
  /**
   * Options for `markdown-it-container`
   * @see https://github.com/markdown-it/markdown-it-container
   */
  container?: ContainerOptions
  /**
   * Math support (experimental)
   *
   * You need to install `markdown-it-mathjax3` and set `math` to `true` to enable it.
   * You can also pass options to `markdown-it-mathjax3` here.
   * @default false
   * @see https://vitepress.dev/guide/markdown#math-equations
   */
  math?: boolean | any
  image?: ImageOptions
  /**
   * Allows disabling the github alerts plugin
   * @default true
   * @see https://vitepress.dev/guide/markdown#github-flavored-alerts
   */
  gfmAlerts?: boolean

  isHighlightHeader?: boolean
}

export type MarkdownRenderer = MarkdownIt
// 暂时用不到
// , base = ''
export async function createMarkdownRenderer(options: MarkdownOptions = {}): Promise<MarkdownRenderer> {
  const theme = options.theme ?? { light: 'vitesse-light', dark: 'andromeeda' }
  const codeCopyButtonTitle = options.codeCopyButtonTitle || 'Copy Code'
  const hasSingleTheme = typeof theme === 'string' || 'name' in theme

  // @ts-ignore
  /* const md = MarkdownIt({
    html: true,
    linkify: true,
    highlight: options.highlight || (await highlight(theme, options)),
    ...options,
  }) */
  const md = MarkdownIt({
    html: true,
    linkify: true,
    highlight: await highlight(theme, options),
    ...options,
  })

  md.linkify.set({ fuzzyLink: false })
  md.use(restoreEntities)

  if (options.preConfig) {
    options.preConfig(md)
  }

  md.use(highlightLinePlugin)
  md.use(preWrapperPlugin, { codeCopyButtonTitle, hasSingleTheme })
  md.use(containerPlugin, { hasSingleTheme }, options.container)
  md.use(imagePlugin, options.image)
  md.use(linkPlugin, { target: '_blank', rel: 'noreferrer', ...options.externalLinks }, '/')
  md.use(lineNumberPlugin, options.lineNumbers)

  // @ts-ignore
  const tableOpen = md.renderer.rules.table_open
  md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    if (token.attrIndex('tabindex') < 0) token.attrPush(['tabindex', '0'])
    return tableOpen
      ? tableOpen(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }

  if (options.gfmAlerts) {
    md.use(gitHubAlertsPlugin)
  }

  // third party plugins
  if (!options.attrs?.disable) {
    md.use(attrsPlugin, options.attrs)
  }
  md.use(emojiPlugin, { ...options.emoji })

  // mdit-vue plugins
  md.use(anchorPlugin, {
    slugify,
    permalink: anchorPlugin.permalink.linkInsideHeader({
      symbol: '&ZeroWidthSpace;',
      renderAttrs: (slug, state) => {
        // Find `heading_open` with the id identical to slug
        const idx = state.tokens.findIndex(token => {
          const attrs = token.attrs
          const id = attrs?.find(attr => attr[0] === 'id')
          return id && slug === id[1]
        })
        // Get the actual heading content
        const title = state.tokens[idx + 1].content
        return {
          'aria-label': `Permalink to "${title}"`,
        }
      },
    }),
    ...options.anchor,
  } as anchorPlugin.AnchorOptions)

  if (options.headers) {
    md.use(headersPlugin, {
      level: [1, 2, 3, 4, 5, 6],
      slugify,
      ...(typeof options.headers === 'boolean' ? undefined : options.headers),
    } as HeadersPluginOptions)
  }

  md.use(titlePlugin)

  md.use(tocPlugin, {
    ...options.toc,
  } as TocPluginOptions)

  /*   
  // TODO: 数学公式处理  暂时不引入 math
  if (options.math) {
    try {
      const mathPlugin = await import('markdown-it-mathjax3')
      md.use(mathPlugin.default ?? mathPlugin, {
        ...(typeof options.math === 'boolean' ? {} : options.math),
      })
      const orig = md.renderer.rules.math_block!
      md.renderer.rules.math_block = (tokens, idx, options, env, self) => {
        return orig(tokens, idx, options, env, self).replace(/^<mjx-container /, '<mjx-container tabindex="0" ')
      }
    } catch (error) {
      throw new Error('You need to install `markdown-it-mathjax3` to use math support.')
    }
  } */

  md.use(highlightHeader)

  // apply user config
  if (options.config) {
    options.config(md)
  }

  return md
}
