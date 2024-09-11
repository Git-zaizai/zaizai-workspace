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

export function getHeaders(range?: any): MenuItem[] {
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

  return resolveHeaders(headers, range)
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
  return buildTree(headers, 2, 6)
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

export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeoutId: number
  let called = false

  return () => {
    if (timeoutId) clearTimeout(timeoutId)

    if (!called) {
      fn()
      ;(called = true) && setTimeout(() => (called = false), delay)
    } else timeoutId = setTimeout(fn, delay)
  }
}

export function useActiveAnchor(container: Ref<HTMLElement>, marker: Ref<HTMLElement>, fn: Function): void {
  const onScroll = throttleAndDebounce(setActiveLink, 100)

  let scrollElement: any = fn()
  let prevActiveLink: HTMLAnchorElement | null = null

  onMounted(() => {
    requestAnimationFrame(setActiveLink)
    window.addEventListener('scroll', onScroll)
  })

  onUpdated(() => {
    // sidebar update means a route change
    activateLink(location.hash)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  function setActiveLink() {
    console.log('setActiveLink')

    const VPLocalNav = document.querySelector('#VPLocalNavId')
    // @ts-ignore
    if (VPLocalNav && VPLocalNav.style?.display === 'none') {
      return
    }

    const scrollY = scrollElement.scrollY
    const innerHeight = scrollElement.innerHeight
    const offsetHeight = scrollElement.offsetHeight
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

    // resolvedHeaders may be repositioned, hidden or fix positioned
    const headers = resolvedHeaders
      .map(({ element, link }) => ({
        link,
        top: getAbsoluteTop(element),
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top)

    // no headers available for active link
    if (!headers.length) {
      activateLink(null)
      return
    }

    // page top
    if (scrollY < 1) {
      activateLink(null)
      return
    }

    // page bottom - highlight last link
    if (isBottom) {
      activateLink(headers[headers.length - 1].link)
      return
    }

    // find the last header above the top of viewport
    let activeLink: string | null = null
    let index = 0
    for (const { top } of headers) {
      if (top > scrollY + getScrollOffset() + 4) {
        break
      }
      activeLink = headers[index + 1].link
      index++
    }
    activateLink(activeLink)
  }

  function activateLink(hash: string | null) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('active')
    }

    if (hash == null) {
      prevActiveLink = null
    } else {
      prevActiveLink = container.value.querySelector(`a[href="${decodeURIComponent(hash)}"]`)
    }

    const activeLink = prevActiveLink

    if (activeLink) {
      activeLink.classList.add('active')
      marker.value.style.top = activeLink.offsetTop + 39 + 'px'
      marker.value.style.opacity = '1'
    } else {
      marker.value.style.top = '33px'
      marker.value.style.opacity = '0'
    }
  }
}

function getAbsoluteTop(element: HTMLElement): number {
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
    let parent = stack[stack.length - 1]

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

    if (parent) parent.children!.push(node)
    else result.push(node)

    stack.push(node)
  })

  return result
}

export function findScrollableParent(element: any, VPDoc: Ref<HTMLElement>) {
  let current = element

  // 循环向上查找直到找到可滚动的父元素或者到达最顶层元素
  while (current !== null && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
    // 检查当前元素是否可以垂直滚动
    if (current.scrollHeight > current.clientHeight && !VPDoc.value.contains(current)) {
      return current // 找到可滚动的父元素，返回该元素
    }
    current = current.parentNode // 否则继续向上查找
  }

  return null // 没有找到可滚动的父元素，返回null
}

export function isScrollHeight(element: Element) {
  return element.scrollHeight > element.clientHeight
}
