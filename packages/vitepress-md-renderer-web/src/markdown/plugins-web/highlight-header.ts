import type MarkdownIt from 'markdown-it'




export const highlightHeader = (md: MarkdownIt, enable = false) => {
    const fence = md.renderer.rules.fence!
    md.renderer.rules.fence = (...args) => {
        const rawCode = fence(...args)

        return rawCode
    }
}