// import { customAlphabet } from 'nanoid'
// import c from 'picocolors'
import type { ShikiTransformer } from 'shiki'
// import { bundledLanguages, createHighlighter, isSpecialLang } from 'shiki'
import { createHighlighterCore } from 'shiki/core'

import {
  transformerCompactLineOptions,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  type TransformerCompactLineOption,
} from '@shikijs/transformers'
// import type { Logger } from 'vite'
import type { MarkdownOptions, ThemeOptions } from '../markdown'

import { nanoid } from '../../shared/shared-web'

// const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

/**
 * 2 steps:
 *
 * 1. convert attrs into line numbers:
 *    {4,7-13,16,23-27,40} -> [4,7,8,9,10,11,12,13,16,23,24,25,26,27,40]
 * 2. convert line numbers into line options:
 *    [{ line: number, classes: string[] }]
 */
const attrsToLines = (attrs: string): TransformerCompactLineOption[] => {
  attrs = attrs.replace(/^(?:\[.*?\])?.*?([\d,-]+).*/, '$1').trim()
  const result: number[] = []
  if (!attrs) {
    return []
  }
  attrs
    .split(',')
    .map(v => v.split('-').map(v => parseInt(v, 10)))
    .forEach(([start, end]) => {
      if (start && end) {
        result.push(...Array.from({ length: end - start + 1 }, (_, i) => start + i))
      } else {
        result.push(start)
      }
    })
  return result.map(v => ({
    line: v,
    classes: ['highlighted'],
  }))
}

/**
 * https://shiki-zh-docs.vercel.app/guide/install#%E7%BB%86%E7%B2%92%E5%BA%A6%E6%8D%86%E7%BB%91
 * @function highlight 这个是 细粒度捆绑 可以减少打包体积，随意控制
 * @param theme
 * @param options
 * @returns
 */

export async function highlight(
  theme: ThemeOptions,
  options: MarkdownOptions
  // logger: Pick<Logger, 'warn'> = console
): Promise<(str: string, lang: string, attrs: string) => string> {
  const { defaultHighlightLang: defaultLang = '', codeTransformers: userTransformers = [] } = options

  // 只导入需要的语言和主题
  const highlighter = await createHighlighterCore({
    themes: [
      import('shiki/themes/andromeeda.mjs'),
      import('shiki/themes/one-dark-pro.mjs'),
      import('shiki/themes/vitesse-dark.mjs'),
      import('shiki/themes/vitesse-light.mjs'),
    ],
    langs: [
      import('shiki/langs/html.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/less.mjs'),
      import('shiki/langs/scss.mjs'),

      import('shiki/langs/sass.mjs'),
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/jsx.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/js.mjs'),
      import('shiki/langs/ts.mjs'),
      import('shiki/langs/html-derivative.mjs'),

      import('shiki/langs/vue.mjs'),
      import('shiki/langs/vue-directives.mjs'),
      import('shiki/langs/markdown-vue.mjs'),
      import('shiki/langs/vue-interpolations.mjs'),
      import('shiki/langs/vue-html.mjs'),
      import('shiki/langs/vue-sfc-style-variable-injection.mjs'),

      import('shiki/langs/sh.mjs'),
      import('shiki/langs/markdown.mjs'),
    ],
    loadWasm: import('shiki/wasm'),
  })

  const transformers: ShikiTransformer[] = [
    transformerNotationDiff(),
    transformerNotationFocus({
      classActiveLine: 'has-focus',
      classActivePre: 'has-focused-lines',
    }),
    transformerNotationHighlight(),
    transformerNotationErrorLevel(),
    {
      name: 'vitepress:add-class',
      pre(node) {
        this.addClassToHast(node, 'vp-code')
      },
    },
    {
      name: 'vitepress:clean-up',
      pre(node) {
        delete node.properties.style
      },
    },
  ]

  const vueRE = /-vue$/
  const lineNoStartRE = /=(\d*)/
  const lineNoRE = /:(no-)?line-numbers(=\d*)?$/
  const mustacheRE = /\{\{.*?\}\}/g
  return (str: string, lang: string, attrs: string) => {
    const vPre = vueRE.test(lang) ? '' : 'v-pre'
    lang = lang.replace(lineNoStartRE, '').replace(lineNoRE, '').replace(vueRE, '').toLowerCase() || defaultLang

    //这里是判断语言类型
    const langss = highlighter.getLoadedLanguages()
    const getlanguage = langss.includes(lang)

    if (!getlanguage && lang !== '') {
      console.log(`language < ${lang} > 没有导入该语言，请在手动打包shiki中导入该语言`)
      return str
    }

    const lineOptions = attrsToLines(attrs)
    const mustaches = new Map<string, string>()

    const removeMustache = (s: string) => {
      if (vPre) return s
      return s.replace(mustacheRE, match => {
        let marker = mustaches.get(match)
        if (!marker) {
          marker = nanoid()
          mustaches.set(match, marker)
        }
        return marker
      })
    }

    const restoreMustache = (s: string) => {
      mustaches.forEach((marker, match) => {
        s = s.replaceAll(marker, match)
      })
      return s
    }

    str = removeMustache(str).trimEnd()

    const highlighted = highlighter.codeToHtml(str, {
      lang,
      transformers: [
        ...transformers,
        transformerCompactLineOptions(lineOptions),
        {
          name: 'vitepress:v-pre',
          pre(node) {
            if (vPre) node.properties['v-pre'] = ''
          },
        },
        {
          name: 'vitepress:empty-line',
          code(hast) {
            hast.children.forEach(span => {
              if (
                span.type === 'element' &&
                span.tagName === 'span' &&
                Array.isArray(span.properties.class) &&
                span.properties.class.includes('line') &&
                span.children.length === 0
              ) {
                span.children.push({
                  type: 'element',
                  tagName: 'wbr',
                  properties: {},
                  children: [],
                })
              }
            })
          },
        },
        ...userTransformers,
      ],
      meta: { __raw: attrs },
      ...(typeof theme === 'object' && 'light' in theme && 'dark' in theme
        ? { themes: theme, defaultColor: false }
        : { theme }),
    })

    return restoreMustache(highlighted)
  }
}
