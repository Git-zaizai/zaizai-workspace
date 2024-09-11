// import { customAlphabet } from 'nanoid'
// import c from 'picocolors'
import type { ShikiTransformer } from 'shiki'
// import { bundledLanguages, createHighlighter, isSpecialLang } from 'shiki'
import { createHighlighterCore } from 'shiki/core'
import { bundledThemesInfo, bundledLanguages } from 'shiki/bundle-web.mjs'

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
 * https://shiki-zh-docs.vercel.app/guide/bundles
 * @function highlight 这个主要是 加载了所有的 shiki bundle-web 语言  全部加载大概 4.多m 的体积，可以根据 主题和 语言 进行动态加载
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

  let currentTheme =
    typeof theme === 'object' && 'light' in theme && 'dark' in theme ? [theme.light, theme.dark] : [theme]
  const themesFilter = bundledThemesInfo.filter(v => {
    // @ts-ignore
    return currentTheme.includes(v.id)
  })
  const themes = themesFilter.map(v => v.import)

  /***
   * 类型
   * bundledLanguages = {
   *  html: ()=> import(),
   *  ...
   * }
   *
   */
  let defaultLangs: any = []

  if (options.languages && options.languages.length > 0) {
    for (const key in bundledLanguages) {
      // @ts-ignore
      if (options.languages.includes(key)) {
        // @ts-ignore
        defaultLangs.push(bundledLanguages[key])
      }
    }
  } else {
    defaultLangs = Object.values(bundledLanguages)
  }

  const highlighter = await createHighlighterCore({
    themes,
    langs: defaultLangs,
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
    if (lang !== '' && !bundledLanguages.hasOwnProperty(lang)) {
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
