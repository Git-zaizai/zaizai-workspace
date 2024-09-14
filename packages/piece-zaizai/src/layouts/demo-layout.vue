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
    >
      <div
        :style="cssVars"
        class="h-45px gap-1 flex-y-center pl-5px border-b border-b-solid border-b-[--n-border-color]"
      >
        <n-button
          quaternary
          size="small"
          @click="router.go(-1)"
        >
          <Iconify class="i-ph:barn hover:text-[--zai-primary-color-hover]" />
        </n-button>
        <setting-drawer />
      </div>
      <n-menu
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>
    <n-layout-content
      content-style="height:calc(100vh - 67px)"
      :embedded="app.Layoutinverted"
    >
      <default-layout-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import SettingDrawer from '@/components/setting-drawer/index.vue'
import { DefaultLayoutView } from '@/components/layout-router-view'

import { appStore } from '@/store'
import { useCssVars } from '@/hooks/useCssVars'

const app = appStore()
const cssVars = useCssVars(['primaryColorHover'])
const router = useRouter()
const menuOptions = [
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    disabled: true,
    children: [
      {
        label: '鼠',
        key: 'rat',
      },
    ],
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    disabled: true,
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',

    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
          },
          {
            label: '羊男',
            key: 'sheep-man',
          },
        ],
      },
      {
        label: '饮品',
        key: 'beverage',
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
</script>

<style scoped></style>
