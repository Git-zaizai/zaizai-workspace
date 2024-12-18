// @unocss-include
import { consoleLayout } from './constant'
import type { RouteRecordRaw } from 'vue-router'

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
  ],
}

export { consoleRoute }
