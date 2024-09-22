// @unocss-include
import { consoleLayout } from './constant'
import type { RouteRecordRaw } from 'vue-router'

const consoleRoute: RouteRecordRaw = {
  path: '/console',
  name: 'console',
  component: consoleLayout,
  children: [
    {
      path: '',
      meta: {
        title: '控制台',
      },
      component: () => import('@/views/console/index.vue'),
    },
  ],
}

export { consoleRoute }
