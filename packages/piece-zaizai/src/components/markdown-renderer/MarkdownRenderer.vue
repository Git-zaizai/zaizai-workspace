<template>
  <div class="w-100% h-100% pos-relative">
    <VPDocView :content="content" />
  </div>
</template>

<script setup lang="ts">
import { createMarkdownRenderer, VPDocView } from 'vitepress-md-renderer-web'
import { useDebounceFn } from '@vueuse/core'
// import { createMarkdownRenderer, VPDocView } from '../../../../vitepress-md-renderer-web/src/index-web'

const props = defineProps<{
  markdownUrl: string
}>()

const content = ref('')
const getMarkdownStr = async () => {
  const res = await fetch(props.markdownUrl)
  return await res.text()
}

onMounted(async () => {
  if (!props.markdownUrl) {
    window.$message.warning('请传入正确的markdown文件地址')
    return
  }

  const mdRenderer = await createMarkdownRenderer({
    theme: 'andromeeda',
  })
  const mdcontent = await getMarkdownStr()
  let html = mdRenderer.render(mdcontent)
  content.value = html
})

// 预留
const emits = defineEmits(['renderChange'])
const debouncedContent = useDebounceFn(() => {
  emits('renderChange')
}, 100)
onUpdated(() => {
  const codeEl = document.querySelector('.vp-doc h1')
  if (codeEl) {
    debouncedContent()
  }
})
</script>

<style>
@import 'vitepress-md-renderer-web/dist/esm/index.css';
</style>
