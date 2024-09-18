import { onMounted, onUnmounted, onUpdated, type Ref } from 'vue'

export interface Header {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number
  /**
   * The title of the header
   */
  title: string
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string
  /**
   * The children of the header
   */
  children: Header[]
}

// cached list of anchor elements from resolveHeaders
const resolvedHeaders: { element: HTMLHeadElement; link: string }[] = []

export type MenuItem = Omit<Header, 'slug' | 'children'> & {
  element: HTMLHeadElement
  children?: MenuItem[]
}

export function getHeaders(): {
  headerTree: MenuItem[]
  resolvedHeaders: { element: HTMLHeadElement; link: string }[]
} {
  const headers = [...document.querySelectorAll('.VPDoc :where(h1,h2,h3,h4,h5,h6)')]
    .filter(el => el.id && el.hasChildNodes())
    .map(el => {
      const level = Number(el.tagName[1])
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: '#' + el.id,
        level,
      }
    })

  // return resolveHeaders(headers, range)
  let headerTree = buildTree(headers, 1, 6)
  return { headerTree, resolvedHeaders: resolvedHeaders }
}

function serializeHeader(h: Element): string {
  let ret = ''
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (
        (node as Element).classList.contains('VPBadge') ||
        (node as Element).classList.contains('header-anchor') ||
        (node as Element).classList.contains('ignore-header')
      ) {
        continue
      }
      ret += node.textContent
    } else if (node.nodeType === 3) {
      ret += node.textContent
    }
  }
  return ret.trim()
}

export function resolveHeaders(headers: MenuItem[], range?: any): MenuItem[] {
  /* if (range === false) {
    return []
  }

  const levelsRange = (typeof range === 'object' && !Array.isArray(range) ? range.level : range) || 2

  const [high, low]: [number, number] =
    typeof levelsRange === 'number' ? [levelsRange, levelsRange] : levelsRange === 'deep' ? [2, 6] : levelsRange
 */
  return buildTree(headers, 1, 6)
}

export function getScrollOffset() {
  // let scrollOffset = siteDataRef.value.scrollOffset

  let scrollOffset: any = document.querySelector('#app')
  let offset = 0
  let padding = 24
  if (typeof scrollOffset === 'object' && 'padding' in scrollOffset) {
    padding = scrollOffset.padding as number
    scrollOffset = scrollOffset.selector
  }
  if (typeof scrollOffset === 'number') {
    offset = scrollOffset
  } else if (typeof scrollOffset === 'string') {
    offset = tryOffsetSelector(scrollOffset, padding)
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding)
      if (res) {
        offset = res
        break
      }
    }
  }

  return offset
}

function tryOffsetSelector(selector: string, padding: number): number {
  const el = document.querySelector(selector)
  if (!el) return 0
  const bot = el.getBoundingClientRect().bottom
  if (bot < 0) return 0
  return bot + padding
}

export function debounce(fn: () => void, delay: number) {
  let timeoutId: any
  return () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn()
      timeoutId = null
    }, delay)
  }
}

export function getAbsoluteTop(element: HTMLElement): number {
  let offsetTop = 0
  while (element !== document.body) {
    if (element === null) {
      // child element is:
      // - not attached to the DOM (display: none)
      // - set to fixed position (not scrollable)
      // - body or html element (null offsetParent)
      return NaN
    }
    offsetTop += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return offsetTop
}

function buildTree(data: MenuItem[], min: number, max: number): MenuItem[] {
  resolvedHeaders.length = 0

  const result: MenuItem[] = []
  const stack: (MenuItem | { level: number; shouldIgnore: true })[] = []

  data.forEach(item => {
    const node: any = { ...item, children: [] }
    let parent: any = stack[stack.length - 1]

    while (parent && parent.level >= node.level) {
      stack.pop()
      parent = stack[stack.length - 1]
    }

    if (node.element.classList.contains('ignore-header') || (parent && 'shouldIgnore' in parent)) {
      stack.push({ level: node.level, shouldIgnore: true })
      return
    }

    if (node.level > max || node.level < min) return
    resolvedHeaders.push({ element: node.element, link: node.link })

    if (parent) {
      parent.children.push(node)
    } else {
      result.push(node)
    }

    stack.push(node)
  })

  return result
}

export function findScrollableParent(element: any, VPDoc: HTMLElement) {
  let current = element

  // 循环向上查找直到找到可滚动的父元素或者到达最顶层元素
  while (current !== null && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
    // 检查当前元素是否可以垂直滚动
    if (current.scrollHeight > current.clientHeight && !VPDoc.contains(current)) {
      return current // 找到可滚动的父元素，返回该元素
    }
    current = current.parentNode // 否则继续向上查找
  }

  return window // 没有找到可滚动的父元素，返回null
}

export function isScrollHeight(element: Element) {
  return element.scrollHeight > element.clientHeight
}

const timeoutIdMap: WeakMap<HTMLElement, any> = new WeakMap()

export function useCodeGroups(e: any) {
  const el = e.target as HTMLInputElement

  if (el.matches('.vp-code-group input')) {
    // input <- .tabs <- .vp-code-group
    const group = el.parentElement?.parentElement
    if (!group) return

    const i = Array.from(group.querySelectorAll('input')).indexOf(el)
    if (i < 0) return

    const blocks = group.querySelector('.blocks')
    if (!blocks) return

    const current = Array.from(blocks.children).find(child => child.classList.contains('active'))
    if (!current) return

    const next = blocks.children[i]
    if (!next || current === next) return

    current.classList.remove('active')
    next.classList.add('active')

    const label = group?.querySelector(`label[for="${el.id}"]`)
    label?.scrollIntoView({ block: 'nearest' })
  }
}

export function useCopyCode(e: any) {
  const el = e.target as HTMLElement
  if (el.matches('div[class*="language-"] > button.copy')) {
    const parent = el.parentElement
    const sibling = el.nextElementSibling?.nextElementSibling
    if (!parent || !sibling) {
      return
    }

    const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(parent.className)

    const ignoredNodes = ['.vp-copy-ignore', '.diff.remove']

    // Clone the node and remove the ignored nodes
    const clone = sibling.cloneNode(true) as HTMLElement
    clone.querySelectorAll(ignoredNodes.join(',')).forEach(node => node.remove())

    let text = clone.textContent || ''

    if (isShell) {
      text = text.replace(/^ *(\$|>) /gm, '').trim()
    }

    copyToClipboard(text).then(() => {
      el.classList.add('copied')
      clearTimeout(timeoutIdMap.get(el))
      const timeoutId = setTimeout(() => {
        el.classList.remove('copied')
        el.blur()
        timeoutIdMap.delete(el)
      }, 2000)
      timeoutIdMap.set(el, timeoutId)
    })
  }
}

async function copyToClipboard(text: string) {
  try {
    return navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      ;(previouslyFocusedElement as HTMLElement).focus()
    }
  }
}
