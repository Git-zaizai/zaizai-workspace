<template>
  <div class="h-full flex-col-center">
    <h1>web vitepress md文件渲染器</h1>
    <br/>
    <h2>右下角浮动按钮</h2>
    <markdown-float-button :markdownUrl="markdownUrl" />
  </div>
</template>

<script setup lang="ts">
import markdownFloatButton from '@/components/markdown-renderer/markdown-float-button.vue'

const markdownUrl = new URL('./markdown.md', import.meta.url).href
</script>

<style scoped></style>
