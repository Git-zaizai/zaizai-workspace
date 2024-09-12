import type { RouteRecordRaw } from 'vue-router'
import { defulatLayout } from './constant'

export const defaultRouters: RouteRecordRaw[] = [
  {
    path: '/',
    component: defulatLayout,
  },
]

export const routes = [...defaultRouters]
