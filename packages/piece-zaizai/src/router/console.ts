// @unocss-include
import { consoleLayout } from './constant'
import type { RouteRecordRaw } from 'vue-router'
import VscodeIconsFileTypeLightJson from '~icons/vscode-icons/file-type-light-json'

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
  ],
}

export { consoleRoute }
