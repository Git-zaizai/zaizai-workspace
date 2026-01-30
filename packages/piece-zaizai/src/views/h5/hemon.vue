<script setup lang="ts">
import h5Route from '@/router/h5'
import { useCssVars } from '@/hooks/useCssVars'
import coll from './components/coll.vue'

const filters = ['h5-hemon', 'h5-link', 'copy']
const menuOptions = [
  {
    label: '导航页',
    disabled: true,
  },
  ...h5Route.children
    .filter(fv => !filters.includes(fv.name as string))
    .map(route => ({
      label: route.meta?.title || '未命名',
      routePath: route.path,
    })),
]

const cssVars = useCssVars(['modalColor', 'boxShadow1'], {
  'page-bg-color': ['--zai-modal-color', '#F5F7FA'],
})
</script>

<template>
  <div class="h5-page-height p-10" :style="cssVars">
    <coll :options="menuOptions" />
  </div>
</template>

<style lang="scss" scoped>
.h5-page-height {
  background-color: var(--zai-page-bg-color);
}
</style>
