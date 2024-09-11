<script setup lang="ts">
import { createMarkdownRenderer, getEvn } from '../src/index-web'

import { onMounted, ref } from 'vue'

import VPDocView from './VPDocView/VPDocView.vue'

const test = async () => {
  const test = await fetch('markdown.md')
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
    math: true,
  })
  const mdText = await test()
  const env = getEvn()
  content.value = md.render(mdText, env)
  console.log(env)
})
</script>

<template>
  <div ref="scrollt">
    <VPDocView
      :content="content"
      :scroll-el="scrollt!"
    />
  </div>
</template>
