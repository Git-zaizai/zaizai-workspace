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
    component: () => import('@/views/demo/demo-MarkdownRenderer.vue'),
  },
  {
    path: 'loading-vue',
    meta: {
      title: '自定义Loading',
      icon: 'i-ph:spinner-bold',
    },
    component: () => import('@/views/demo/zidingyi-loading.vue'),
  },
  {
    path: 'form',
    meta: {
      title: '表单',
      icon: 'i-ph:waveform-fill',
    },
    component: () => import('@/views/demo/table.vue'),
  },
  {
    path: 'request',
    meta: {
      title: 'fetct',
      icon: 'i-ph:share-network',
    },
    component: () => import('@/views/demo/req.vue'),
  },
]

export default demoRoutes
