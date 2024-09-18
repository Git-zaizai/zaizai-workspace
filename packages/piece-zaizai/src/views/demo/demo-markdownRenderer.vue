<template>
  <div>
    <markdown-float-button :markdownUrl="markdownUrl" />
  </div>
</template>

<script setup lang="ts">
import markdownFloatButton from '@/components/markdown-renderer/markdown-float-button.vue'

const markdownUrl = new URL('./markdown.md', import.meta.url).href
</script>

<style scoped></style>
