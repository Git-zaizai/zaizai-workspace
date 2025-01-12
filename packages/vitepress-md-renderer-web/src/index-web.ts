import type { MarkdownEnv } from './shared/shared-web'
import {
  createMarkdownRenderer as createMdRenderer,
  type MarkdownOptions,
  type MarkdownRenderer,
} from './markdown/markdown-web'

export type BundledTheme =
  | 'andromeeda'
  | 'aurora-x'
  | 'ayu-dark'
  | 'catppuccin-frappe'
  | 'catppuccin-latte'
  | 'catppuccin-macchiato'
  | 'catppuccin-mocha'
  | 'dark-plus'
  | 'dracula'
  | 'dracula-soft'
  | 'everforest-dark'
  | 'everforest-light'
  | 'github-dark'
  | 'github-dark-default'
  | 'github-dark-dimmed'
  | 'github-dark-high-contrast'
  | 'github-light'
  | 'github-light-default'
  | 'github-light-high-contrast'
  | 'houston'
  | 'laserwave'
  | 'light-plus'
  | 'material-theme'
  | 'material-theme-darker'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'night-owl'
  | 'nord'
  | 'one-dark-pro'
  | 'one-light'
  | 'plastic'
  | 'poimandres'
  | 'red'
  | 'rose-pine'
  | 'rose-pine-dawn'
  | 'rose-pine-moon'
  | 'slack-dark'
  | 'slack-ochin'
  | 'snazzy-light'
  | 'solarized-dark'
  | 'solarized-light'
  | 'synthwave-84'
  | 'tokyo-night'
  | 'vesper'
  | 'vitesse-black'
  | 'vitesse-dark'
  | 'vitesse-light'

export type BundledLanguage =
  | 'angular-html'
  | 'angular-ts'
  | 'astro'
  | 'bash'
  | 'blade'
  | 'c'
  | 'c++'
  | 'coffee'
  | 'coffeescript'
  | 'cpp'
  | 'css'
  | 'glsl'
  | 'gql'
  | 'graphql'
  | 'haml'
  | 'handlebars'
  | 'hbs'
  | 'html'
  | 'html-derivative'
  | 'http'
  | 'imba'
  | 'jade'
  | 'java'
  | 'javascript'
  | 'jinja'
  | 'jison'
  | 'jl'
  | 'js'
  | 'json'
  | 'json5'
  | 'jsonc'
  | 'jsonl'
  | 'jsx'
  | 'julia'
  | 'less'
  | 'lit'
  | 'lua'
  | 'markdown'
  | 'marko'
  | 'md'
  | 'mdc'
  | 'mdx'
  | 'php'
  | 'postcss'
  | 'pug'
  | 'py'
  | 'python'
  | 'r'
  | 'rb'
  | 'regex'
  | 'regexp'
  | 'ruby'
  | 'sass'
  | 'scss'
  | 'sh'
  | 'shell'
  | 'shellscript'
  | 'sql'
  | 'styl'
  | 'stylus'
  | 'svelte'
  | 'toml'
  | 'ts'
  | 'ts-tags'
  | 'tsx'
  | 'typescript'
  | 'vue'
  | 'vue-html'
  | 'wasm'
  | 'wgsl'
  | 'xml'
  | 'yaml'
  | 'yml'
  | 'zsh'

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

type theme =
  | BundledTheme
  | {
      light: BundledTheme
      dark: BundledTheme
    }

interface Options extends MarkdownOptions {
  theme?: theme
  languages?: BundledLanguage[]
}

export async function createMarkdownRenderer(options: Options): Promise<MarkdownRenderer> {
  options = {
    attrs: {
      disable: false,
    },
    gfmAlerts: true,
    headers: true,
    math: false,
    ...options,
  }

  return createMdRenderer(options)
}

import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { bundledThemesInfo, bundledLanguages } from 'shiki/bundle-web.mjs'

export function shikiHighlighter(
  theme: BundledTheme | BundledTheme[],
  Langs: string[] | BundledLanguage[]
): Promise<HighlighterCore> {
  let currentTheme = Array.isArray(theme) ? theme : [theme]
  const themesFilter = bundledThemesInfo.filter(v => {
    // @ts-ignore
    return currentTheme.includes(v.id)
  })
  const themes = themesFilter.map(v => v.import)
  return createHighlighterCore({
    themes: themes,
    langs: Langs.map((key: any) => bundledLanguages[key as keyof typeof bundledLanguages]),
    loadWasm: import('shiki/wasm'),
  })
}

export { default as VPDocView } from './VPDocView/VPDocView.vue'
