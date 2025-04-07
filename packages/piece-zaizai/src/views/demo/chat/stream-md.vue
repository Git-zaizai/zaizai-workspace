<script setup lang="ts">
import { createMarkdownRenderer, getEvn } from 'vitepress-md-renderer-web'
import { useDark } from '@vueuse/core'

const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = import.meta.env
const baseUrl = VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX

const theme = ref('dark') // dark
let mdRenderer
const content = ref('')
const getChat = async () => {
  let result = ''

  const response = await fetch(baseUrl + 'stream-md', {
    method: 'POST',
  })
  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  const env = getEvn()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    result += decoder.decode(value)
    content.value = mdRenderer.render(result, env)
  }
}

const getmd = async () => {
  const response = await fetch(baseUrl + 'upload/markdown.md')
  const body = await response.text()
  const env = getEvn()
  content.value = mdRenderer.render(body, env)
}

onMounted(async () => {
  mdRenderer = await createMarkdownRenderer({
    attrs: {
      disable: false,
    },
    gfmAlerts: true,
    headers: true,
    math: false,
    theme: 'one-dark-pro',
  })
  // getmd()
})

watchEffect(() => {
  if (theme.value === 'dark') {
    // document.documentElement.classList.add('vitepress-dark')
  } else {
    document.documentElement.classList.remove('vitepress-dark')
  }
})
</script>

<template>
  <div class="demo-content-view">
    <n-card>
      <n-space>
        <n-button @click="getChat">stream-md 获取数据</n-button>
        <n-button @click="getmd">md 获取数据</n-button>
        <n-switch
          v-model:value="theme"
          checked-value="light"
          unchecked-value="dark"
        >
        </n-switch>
        {{ theme === 'dark' ? '深色模式' : '浅色模式' }}
      </n-space>
    </n-card>

    <div class="h-5"></div>

    <div class="VPDoc">
      <div class="p-10px">
        <div class="vp-doc">
          <div v-html="content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('./styles/index.css');
</style>
