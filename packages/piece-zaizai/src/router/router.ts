import type { RouteRecordRaw } from 'vue-router'
import { defulatLayout, demoLayout } from './constant'

import index from '@/views/home/index.vue'
import demors from './demo'

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

export const routes = [...commonRoutes, defaultRouters, demoRouters]
