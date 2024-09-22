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
// const menuOptions = initMenu(router.getRoutes().find(v => v.name === 'demo-layout').children, '/demo')
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        'a',
        {
          href: 'https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F',
          target: '_blank',
          rel: 'noopenner noreferrer',
        },
        '且听风吟'
      ),
    key: 'hear-the-wind-sing',
    icon: DefaultMenuIcon,
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    icon: DefaultMenuIcon,
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
            icon: DefaultMenuIcon,
          },
          {
            label: '羊男',
            key: 'sheep-man',
            icon: DefaultMenuIcon,
            children: [
              {
                type: 'group',
                label: '人物',
                key: 'people',
                children: [
                  {
                    label: '叙事者',
                    key: 'narrator',
                    icon: DefaultMenuIcon,
                  },
                  {
                    label: '羊男',
                    key: 'sheep-man',
                    icon: DefaultMenuIcon,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    icon: DefaultMenuIcon,
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    icon: DefaultMenuIcon,
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
            icon: DefaultMenuIcon,
          },
          {
            label: '羊男',
            key: 'sheep-man',
            icon: DefaultMenuIcon,
          },
        ],
      },
      {
        label: '饮品',
        key: 'beverage',
        icon: DefaultMenuIcon,
        children: [
          {
            label: '威士忌',
            key: 'whisky',
          },
        ],
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich',
          },
        ],
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes',
      },
    ],
  },
]

const selectedKey = ref(route.path)
watchEffect(() => {
  selectedKey.value = (route.name as string) ?? route.path
})
</script>

<style scoped></style>
