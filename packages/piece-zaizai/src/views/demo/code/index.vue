<script setup lang="ts">
import markdownFloatButton from '@/components/markdown-renderer/markdown-float-button.vue'

defineOptions({
  name: 'code-snippet',
})

const markdownUrl = new URL('./code.md', import.meta.url).href

function queryElement(id: string): Promise<Element> {
  return new Promise(resolve => {
    let timer = null
    const run = () => {
      let element = document.querySelector(id)
      if (element) {
        clearInterval(timer)
        resolve(element)
      } else if (timer === null) {
        timer = setInterval(() => {
          element = document.querySelector(id)
          if (element) {
            clearInterval(timer)
            resolve(element)
          }
        }, 0)
      }
    }
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(run)
    } else {
      timer = setInterval(run, 0)
    }
  })
}

function getElementSize(element) {
  if (element.getBoundingClientRect) {
    const rect = element.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
    }
  } else if (typeof element.offsetWidth !== 'undefined') {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight,
    }
  }
  return {
    width: null,
    height: null,
  }
}

function getElementGeometry(element) {
  if (element.getBoundingClientRect) {
    return element.getBoundingClientRect()
  } else if (typeof element.offsetWidth !== 'undefined') {
    let geometry = {
      width: null,
      height: null,
      top: null,
      left: null,
      right: null,
      bottom: null,
    }
    geometry.width = element.offsetWidth
    geometry.height = element.offsetHeight
    let currentElement = element
    geometry.top = 0
    geometry.left = 0
    while (currentElement) {
      geometry.top += currentElement.offsetTop
      geometry.left += currentElement.offsetLeft
      currentElement = currentElement.offsetParent
    }
    geometry.right = geometry.left + geometry.width
    geometry.bottom = geometry.top + geometry.height
    return geometry
  }
}
onMounted(async () => {
  const element = await queryElement('#sele')
  console.log(element)
})
</script>

<template>
  <div class="demo-content-view">
    <markdown-float-button :markdownUrl="markdownUrl" />

    <div
      class="w-4xl h-4xl"
      id="sele"
    ></div>
  </div>
</template>

<style lang="scss" scoped></style>
