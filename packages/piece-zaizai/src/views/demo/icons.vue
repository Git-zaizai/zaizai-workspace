<template>
  <div class="demo-content-view flex-col-center">
    <h1>unplugin-icons插件的方式</h1>
    <h2>显示引入</h2>
    <PhWarningOctagonBold />
    <div class="w-full h-1px bg-amber"></div>

    <h2>配合自动导入</h2>
    <i-ph-acorn-duotone />
    <div class="w-full h-1px bg-amber"></div>

    <h5>本地 自定义合集</h5>
    <i-local-test3 />
    <div class="w-full h-1px bg-amber"></div>

    <h5>unocss 的 class css 图标</h5>
    <i class="i-ph-warning-octagon-bold"></i>

    <div class="w-full h-1px bg-amber"></div>

    <h5>unocss class 配合 自定义组件</h5>
    <Iconify class="i-ph-warning-octagon-bold" />

    <div class="w-full h-1px bg-amber"></div>
    
    <markdown-float-button :markdownUrl="markdownUrl" />
  </div>
</template>
<script lang="ts" setup>
import PhWarningOctagonBold from '~icons/ph/warning-octagon-bold'

import markdownFloatButton from '@/components/markdown-renderer/markdown-float-button.vue'
const markdownUrl = new URL('./icons.md', import.meta.url).href
</script>
