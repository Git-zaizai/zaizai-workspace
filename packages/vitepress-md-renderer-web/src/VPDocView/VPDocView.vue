<script setup lang="ts">
import '../styles/fonts.css'
import '../styles/vars.css'
import '../styles/icons.css'
import '../styles/base.css'
import '../styles/utils.css'
import '../styles/components/custom-block.css'
import '../styles/components/vp-code-group.css'
import '../styles/components/vp-code.css'
import '../styles/components/vp-doc.css'
import '../styles/components/vp-sponsor.css'

import VPDocOutlineItem from './VPDocOutlineItem.vue'
import VPLocalNavOutlineDropdown from './VPLocalNavOutlineDropdown.vue'

import { ref, shallowRef, onMounted, nextTick, computed, type Ref, watch, onUnmounted } from 'vue'

import {
  type MenuItem,
  getHeaders,
  useActiveAnchor,
  findScrollableParent,
  isScrollHeight,
  useCodeGroups,
  useCopyCode,
} from './outline'

const props = withDefaults(
  defineProps<{
    leftAside?: boolean
    externalLinkIcon?: boolean
    content: string
    isAsideContainerPadding?: boolean
    scrollEl?: HTMLElement | string
  }>(),
  { leftAside: false, isAsideContainerPadding: true }
)

const headers = shallowRef<MenuItem[]>([])
const AsideContainerPadding = computed(() => {
  if (props.isAsideContainerPadding) {
    return ''
  }
  return `padding:calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + var(--vp-doc-top-height, 0px) + -62px);`
})

const vodeoConentRef = ref<HTMLDivElement>()
const container = ref<HTMLElement>()
const marker = ref<HTMLElement>()
const VPdoc = ref<HTMLElement>()

const getScrollElement = (target: Element) => {
  let scrollElement = typeof props.scrollEl !== 'string' ? props.scrollEl : document.querySelector(props.scrollEl)
  if (scrollElement && !isScrollHeight(scrollElement)) {
    scrollElement = findScrollableParent(target, VPdoc as Ref<HTMLElement>)
  }
  return scrollElement ?? window
}

useActiveAnchor(container as Ref<HTMLElement>, marker as Ref<HTMLElement>, getScrollElement)

watch(
  () => props.content,
  value => {
    if (value) {
      nextTick(() => {
        headers.value = getHeaders()
      })
    }
  }
)

const winClick = (e: any) => {
  let href: string = e.target.getAttribute('href')
  const selector: HTMLElement | null = VPdoc.value?.querySelector(href) ?? document.querySelector(href)
  if (e.target.tagName === 'A' && href && selector) {
    e.preventDefault()
    let scrollElement = getScrollElement(e.target)

    if (href.split('#').length === 2 && href.split('#')[1] === '' && scrollElement) {
      scrollElement.scrollTo({ top: 0, behavior: 'smooth' })
    }
    let top = selector.offsetTop
    if (scrollElement) {
      scrollElement.scrollTo({ top, behavior: 'smooth' })
    }
  }
}

onMounted(() => {
  window.addEventListener('click', winClick)
  window.addEventListener('click', useCodeGroups)
  window.addEventListener('click', useCopyCode)
})
onUnmounted(() => {
  window.removeEventListener('click', winClick)
  window.removeEventListener('click', useCodeGroups)
  window.removeEventListener('click', useCopyCode)
})
</script>

<template>
  <div
    class="VPDoc has-sidebar has-aside"
    ref="VPdoc"
  >
    <VPLocalNavOutlineDropdown :headers="headers" />
    <div class="container">
      <div
        class="aside"
        :class="{ 'left-aside': leftAside }"
      >
        <div class="aside-curtain" />
        <div
          class="aside-container"
          :style="AsideContainerPadding"
        >
          <div class="aside-content">
            <div class="VPDocAside">
              <nav
                aria-labelledby="doc-outline-aria-label"
                class="VPDocAsideOutline"
                :class="{ 'has-outline': headers.length > 0 }"
                ref="container"
              >
                <div class="VPDocAside-content">
                  <div
                    class="outline-marker"
                    ref="marker"
                  ></div>

                  <div
                    aria-level="2"
                    class="outline-title"
                    id="doc-outline-aria-label"
                    role="heading"
                  >
                    <a
                      class="outline-link"
                      href="#"
                      >本页目录</a
                    >
                  </div>

                  <VPDocOutlineItem
                    :headers="headers"
                    :root="true"
                  />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content-container">
          <slot name="doc-before" />
          <main class="main">
            <div
              class="vp-doc"
              ref="vodeoConentRef"
              :class="[externalLinkIcon && 'external-link-icon-enabled']"
            >
              <div v-html="content"></div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPDoc {
  padding: 32px 24px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .VPDoc {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .VPDoc {
    padding: 48px 32px 0;
  }

  .VPDoc:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .VPDoc:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .VPDoc .container {
    display: flex;
    justify-content: center;
  }

  .VPDoc .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .VPDoc:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .VPDoc:not(.has-sidebar) .container {
    max-width: 1104px;
  }
}

.container {
  margin: 0 auto;
  width: 100%;
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}

.left-aside {
  order: 1;
  padding-left: unset;
  padding-right: 32px;
}

.aside-container {
  position: fixed;
  top: 0;
  padding-top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + var(--vp-doc-top-height, 0px) + 48px);
  width: 224px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-c-bg) 70%);
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px));
  padding-bottom: 32px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
  }
}

.content-container {
  margin: 0 auto;
}

/* .VPDoc.has-aside .content-container {
  max-width: 688px;
} */

/**  VPDocAsideOutline.vue  **/

.VPDocAsideOutline {
  display: none;
}

.VPDocAsideOutline.has-outline {
  display: block;
}

.VPDocAside-content {
  position: relative;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  opacity: 0;
  width: 2px;
  border-radius: 2px;
  height: 18px;
  background-color: var(--vp-c-brand-1);
  transition: top 0.25s cubic-bezier(0, 1, 0.5, 1), background-color 0.5s, opacity 0.25s;
}

.outline-title {
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
}

.outline-link {
  transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out;
  cursor: pointer;
}

.outline-link:hover {
  color: var(--vp-c-text-2);
}
</style>
