<script setup lang="ts">
import { createMarkdownRenderer, getEvn } from '../../src/index-web'
import { nextTick, onMounted, ref } from 'vue'
import { useCopyCode } from '../../src/VPDocView/outline'

const test = async () => {
  const test = await fetch('b.md')
  return await test.text()
}

const content = ref('')
const scrollt = ref<HTMLElement>()

onMounted(async () => {
  const md = await createMarkdownRenderer({
    attrs: {
      disable: false,
    },
    gfmAlerts: true,
    headers: true,
    math: false,
    theme: 'andromeeda',
  })
  const mdText = await test()
  const env = getEvn()
  content.value = md.render(mdText, env)
  console.log(env)
  nextTick(() => {
    window.addEventListener('click', useCopyCode)
  })
})
</script>

<template>
  <div
    ref="scrollt"
    class="vitepress-dark chat chat-dark"
  >
    <div
      class="vp-doc"
      ref="vodeoConentRef"
    >
      <div class="doc-code">
        <div class="doc-code-header">
          <div class="doc-code-header-left"></div>
          <div class="doc-code-header-right">
            <button class="link"></button>
          </div>
        </div>
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../src/styles/vp-chat.css';
</style>
