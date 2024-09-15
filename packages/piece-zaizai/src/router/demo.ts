// @unocss-include
import type { RouteRecordRaw } from 'vue-router'

const demoRoutes: RouteRecordRaw[] = [
  {
    path: '404',
    component: () => import('@/views/common/404.vue'),
  },
  {
    path: 'MarkdownRenderer',
    meta: {
      title: 'MarkdownRenderer',
      icon: 'i-ph:markdown-logo',
    },
    component: () => import('@/views/demo/MarkdownRenderer.vue'),
  },
]

export default demoRoutes
