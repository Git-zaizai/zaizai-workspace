<template>
  <n-layout
    has-sider
    class="h-100vh"
  >
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger="bar"
      :native-scrollbar="false"
      default-collapsed
    >
      <div
        :style="cssVars"
        class="px-10px py-5px flex-x-center flex-wrap border-b border-b-solid border-b-[--n-border-color]"
      >
        <n-button
          quaternary
          size="small"
          class="flex-1 my-5px"
          @click="router.push('/')"
        >
          <Iconify class="i-ph:barn hover:text-[--zai-primary-color-hover]" />
        </n-button>
        <setting-drawer :setting-button-props="{ class: 'flex-1 my-5px' }" />
      </div>
      <Menu
        router
        route-path="/demo"
        route-name="demo-layout"
      />
    </n-layout-sider>
    <n-layout-content :embedded="app.Layoutinverted">
      <default-layout-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import SettingDrawer from '@/components/setting-drawer/index.vue'
import { DefaultLayoutView } from '@/components/layout-router-view'
import Iconify from '@/components/Iconify.vue'
import Menu from './components/menu.vue'

import { appStore } from '@/store'
import { useCssVars } from '@/hooks/useCssVars'

const app = appStore()
const cssVars = useCssVars(['primaryColorHover'])
const router = useRouter()
</script>

<style scoped></style>
