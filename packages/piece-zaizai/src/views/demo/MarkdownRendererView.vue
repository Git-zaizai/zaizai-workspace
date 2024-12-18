<template>
  <MarkdownRenderer
    v-if="$route.query?.markdownUrl"
    :markdownUrl="$route.query.markdownUrl as string"
  />
  <div
    v-else
    class="w-100vw h-100vh flex-col-center"
  >
    <n-result
      status="404"
      title="404"
      description="找不到 markdown 文档"
      size="huge"
    >
    </n-result>
  </div>
</template>

<script setup lang="ts">
import MarkdownRenderer from '@/components/markdown-renderer/MarkdownRenderer.vue'
import { appStore } from '@/store'

const app = appStore()
watch(
  () => app.theme,
  value => {
    if (value === 'dark') {
      document.documentElement.classList.add('vitepress-dark')
      document.body.style.backgroundColor = 'rgb(24, 24, 28)'
    } else {
      document.documentElement.classList.remove('vitepress-dark')
      document.body.style.backgroundColor = '#fff'
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
