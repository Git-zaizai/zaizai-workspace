// @unocss-include
import { h5Layout } from './constant'
import type { RouteRecordRaw } from 'vue-router'

const h5Route: RouteRecordRaw = {
  path: '/h5-index',
  name: 'h5-index',
  component: h5Layout,
  children: [
    {
      path: 'h5-hemon',
      name: 'h5-hemon',
      meta: {
        title: 'h5-hemon',
      },
      component: () => import('@/views/h5/hemon.vue'),
    },
    {
      // 使用这样的 默认路由方式时 不写path，需要给一个name
      path: 'h5-link',
      name: 'h5-link',
      meta: {
        title: 'link',
      },
      component: () => import('@/views/console/novel/h5-link.vue'),
    },
    {
      // 使用这样的 默认路由方式时 不写path，需要给一个name
      path: 'copy',
      name: 'copy',
      meta: {
        title: 'link',
      },
      component: () => import('@/views/h5/copy-str.vue'),
    },
    {
      path: 'vxete',
      name: 'vxete',
      meta: {
        title: 'vxete.con的txt',
      },
      component: () => import('@/views/h5/vxete.vue'),
    },
  ],
}

export default h5Route
