<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { menuProps } from 'naive-ui'
import Iconify from '@/components/Iconify.vue'
import { type RouteRecordRaw, RouterLink } from 'vue-router'
import { isComponent } from '@/utils'
import type { VNodeChild } from 'vue'

defineOptions({
  name: 'zai-menu',
})

const DefaultMenuIcon = () => h(Iconify, { class: 'i-ph:app-store-logo-bold' })
const MenuIcon = (c: string) => () => h(Iconify, { class: c })

const initMenu = (list: RouteRecordRaw[], routePath?: string): MenuOption[] => {
  let menu: MenuOption[] = []
  list.forEach(item => {
    let to = item.name ? { name: item.name } : routePath + '/' + item.path

    let labelStr = item.meta?.title as string
    let label: string | (() => VNodeChild)
    let icon: any

    if (!item?.meta || !item.meta?.icon) {
      icon = DefaultMenuIcon
    } else if (typeof item.meta.icon === 'string') {
      icon = MenuIcon(item.meta.icon)
    } else if (isComponent(item.meta.icon)) {
      icon = () => h(item.meta.icon)
    } else {
      icon = DefaultMenuIcon
    }

    if (!item.component && item.children && item.children.length) {
      label = labelStr
    } else if (item.component) {
      label = () => h(RouterLink, { to }, { default: () => labelStr })
    }

    let menuItem: MenuOption = {
      key: typeof to === 'string' ? to : (to.name as string),
      label,
      icon,
    }
    if (item.children && item.children.length > 0) {
      menuItem.children = initMenu(item.children, routePath + '/' + item.path)
    }
    menu.push(menuItem)
  })
  return menu
}

const props = defineProps({
  ...menuProps,
  routeName: {
    type: String,
    default: '',
  },
  routePath: {
    type: String,
    default: '',
  },
  router: {
    type: Boolean,
    default: false,
  },
  collapsedWidth: {
    type: Number,
    default: 64,
  },
  collapsedIconSize: {
    type: Number,
    default: 22,
  },
})

let router = useRouter()
let route = useRoute()
let menuOptions = props.options
const movdelValue = defineModel('value', {
  type: String,
  default: '',
})

if (props.router) {
  router = useRouter()
  route = useRoute()
  menuOptions = initMenu(router.getRoutes().find(v => v.name === props.routeName).children, props.routePath)
  watchEffect(() => {
    movdelValue.value = (route.name as string) || route.fullPath
  })
}
</script>

<template>
  <n-menu
    v-bind="props"
    :collapsed-width="props.collapsedWidth"
    :collapsed-icon-size="props.collapsedIconSize"
    :options="menuOptions"
    v-model:value="movdelValue"
  />
</template>
