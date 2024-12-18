<template>
  <n-layout class="h-100vh">
    <n-layout-header
      :inverted="app.Layoutinverted"
      bordered
      class="h-67px flex-y-center px-5"
    >
      <router-link
        to="/"
        class="flex-y-center"
      >
        <img
          src="@/assets/logo.png"
          class="h-40px w-40px ml-3"
        />
      </router-link>

      <div class="w-10vw"></div>

      <n-menu
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        v-model:value="selectedKey"
        mode="horizontal"
        :inverted="app.Layoutinverted"
      />

      <div>
        <setting-drawer />
      </div>
    </n-layout-header>
    <n-layout-content :embedded="app.Layoutinverted">
      <default-layout-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import SettingDrawer from '@/components/setting-drawer/index.vue'
import { DefaultLayoutView } from '@/components/layout-router-view'
import Iconify from '@/components/Iconify.vue'

import { appStore } from '@/store'
import { useCssVars } from '@/hooks/useCssVars'
import { h } from 'vue'
import type { MenuOption } from 'naive-ui'
import { type RouteRecordRaw, RouterLink } from 'vue-router'

const DefaultMenuIcon = () => h(Iconify, { class: 'i-ph:app-store-logo-bold' })
const MenuIcon = (c: string) => () => h(Iconify, { class: c })
const initMenu = (list: RouteRecordRaw[], routePath?: string): MenuOption[] => {
  let menu: MenuOption[] = []
  list.forEach(item => {
    let to = (item.name as string) ?? routePath + '/' + item.path
    let label = item.meta?.title ?? to
    let icon: any = item.meta?.icon ? MenuIcon(item.meta.icon as string) : DefaultMenuIcon
    let menuItem: MenuOption = {
      key: to,
      label: () => h(RouterLink, { to }, { default: () => label }),
      icon,
    }
    if (item.children && item.children.length > 0) {
      menuItem.children = initMenu(item.children, routePath + '/' + item.path)
    }
    menu.push(menuItem)
  })
  return menu
}

const app = appStore()
const cssVars = useCssVars(['primaryColorHover'])
const router = useRouter()
const route = useRoute()
const menuOptions = initMenu(router.getRoutes().find(v => v.name === 'console').children, '/console')

const selectedKey = ref(route.path)
watchEffect(() => {
  selectedKey.value = (route.name as string) ?? route.path
})
</script>

<style scoped></style>
