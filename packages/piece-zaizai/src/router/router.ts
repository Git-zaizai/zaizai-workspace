import type { RouteRecordRaw } from 'vue-router'
import { defulatLayout, demoLayout } from './constant'

import index from '@/views/home/index.vue'

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
  component: demoLayout,
}

export const routes = [defaultRouters, demoRouters]
