// markdown-it plugin for generating line numbers.
// It depends on preWrapper plugin.

import type MarkdownIt from 'markdown-it'

/**
 *
 * @function lineNumberPlugin 行号
 *


 ```ts:line-numbers {1}
 // 启用行号
 const line2 = 'This is line 2'
 const line3 = 'This is line 3'
 ```

 ```ts:line-numbers=2 {1}
 // 行号已启用，并从 2 开始
 const line3 = 'This is line 3'
 const line4 = 'This is line 4'
 ```



 */

export const lineNumberPlugin = (md: MarkdownIt, enable = false) => {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args)
    
    const [tokens, idx] = args
    const info = tokens[idx].info

    if ((!enable && !/:line-numbers($| |=)/.test(info)) || (enable && /:no-line-numbers($| )/.test(info))) {
      return rawCode
    }

    let startLineNumber = 1
    const matchStartLineNumber = info.match(/=(\d*)/)
    if (matchStartLineNumber && matchStartLineNumber[1]) {
      startLineNumber = parseInt(matchStartLineNumber[1])
    }

    const code = rawCode.slice(rawCode.indexOf('<code>'), rawCode.indexOf('</code>'))

    const lines = code.split('\n')

    const lineNumbersCode = [...Array(lines.length)]
      .map((_, index) => `<span class="line-number">${ index + startLineNumber }</span><br>`)
      .join('')

    const lineNumbersWrapperCode = `<div class="line-numbers-wrapper" aria-hidden="true">${ lineNumbersCode }</div>`

    const finalCode = rawCode
      .replace(/<\/div>$/, `${ lineNumbersWrapperCode }</div>`)
      .replace(/"(language-[^"]*?)"/, '"$1 line-numbers-mode"')

    return finalCode
  }
}
