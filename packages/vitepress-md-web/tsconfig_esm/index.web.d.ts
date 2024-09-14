type BundledTheme =
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

type BundledLanguage =
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

import MarkdownIt from 'markdown-it'

type MarkdownRenderer = MarkdownIt

import { MarkdownOptions } from './markdown/markdown-web'

type theme =
  | BundledTheme
  | {
      light: BundledTheme
      dark: BundledTheme
    }

type Options = {
  theme?: theme
  languages?: BundledLanguage[]
} & MarkdownOptions

declare function createMarkdownRenderer(options: Options): MarkdownRenderer
declare const VPDocView = import('vue').DefineComponent<{
  leftAside: {
    type: boolean
    default: true
  }
  externalLinkIcon: {
    type: boolean
  }
  content: {
    type: string
    default: string
  }
  isAsideContainerPadding: {
    type: boolean
    default: true
  }
  scrollEl: {
    type: HTMLElement | string
  }
}>