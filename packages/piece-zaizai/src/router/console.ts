// @unocss-include
import { consoleLayout } from './constant'
import type { RouteRecordRaw } from 'vue-router'
import VscodeIconsFileTypeLightJson from '~icons/vscode-icons/file-type-light-json'
import PhTwitterLogoFill from '~icons/ph/twitter-logo-fill'
import PhBackpackDuotone from '~icons/ph/backpack-duotone'

const consoleRoute: RouteRecordRaw = {
  path: '/console',
  name: 'console',
  component: consoleLayout,
  children: [
    {
      // 使用这样的 默认路由方式时 不写path，需要给一个name
      path: '',
      name: 'console-default',
      meta: {
        title: '控制台',
      },
      component: () => import('@/views/console/index.vue'),
    },
    {
      path: 'json',
      name: 'json',
      meta: {
        title: 'JSON',
        icon: VscodeIconsFileTypeLightJson,
      },
      component: () => import('@/views/console/json.vue'),
    },
    {
      path: 'ws',
      name: 'ws',
      meta: {
        title: 'ws',
        icon: PhTwitterLogoFill,
      },
      component: () => import('@/views/console/ws.vue'),
    },
    {
      path: 'link',
      name: 'link',
      meta: {
        title: 'novel',
        icon: PhBackpackDuotone,
      },
      component: () => import('@/views/console/novel/index.vue'),
    },
  ],
}

export { consoleRoute }
