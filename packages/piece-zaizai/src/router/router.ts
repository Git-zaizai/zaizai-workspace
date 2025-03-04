import type { RouteRecordRaw } from 'vue-router'
import { defulatLayout, demoLayout } from './constant'

import index from '@/views/home/index.vue'
import demors from './demo'
import { consoleRoute } from './console'
import h5Route from './h5'

const commonRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/common/404.vue'),
    meta: {
      title: '404',
    },
  },
]

export const defaultRouters: RouteRecordRaw = {
  path: '/',
  component: defulatLayout,
  children: [
    {
      path: '',
      name: '',
      component: index,
    },
  ],
}

const demoRouters: RouteRecordRaw = {
  path: '/demo',
  name: 'demo-layout',
  component: demoLayout,
  children: demors,
}

const markdownRoute: RouteRecordRaw = {
  path: '/markdown',
  name: 'markdown',
  component: () => import('@/views/demo/MarkdownRendererView.vue'),
}

export const routes = [...commonRoutes, defaultRouters, demoRouters, markdownRoute, consoleRoute, h5Route]
