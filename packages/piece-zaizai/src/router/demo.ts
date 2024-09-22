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
    component: () => import('@/views/demo/demo-markdown-renderer.vue'),
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
    path: 'form-v1',
    meta: {
      title: '表单-v1',
      icon: 'i-ph:waveform-fill',
    },
    component: () => import('@/views/demo/table/table-v1.vue'),
  },
  {
    path: 'form-v2',
    meta: {
      title: '表单-v2',
      icon: 'i-ph:waveform-fill',
    },
    component: () => import('@/views/demo/table/table-v2.vue'),
  },
]

export default demoRoutes
