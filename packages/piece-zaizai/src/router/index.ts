import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { routes } from './router'

const { VITE_GLOB_ROUTER_PREFIX, VITE_GLOB_ROUTER_FN } = import.meta.env

const router = createRouter({
  history:
    VITE_GLOB_ROUTER_FN === 'hash'
      ? createWebHashHistory(VITE_GLOB_ROUTER_PREFIX)
      : createWebHistory(VITE_GLOB_ROUTER_PREFIX),
  routes: routes,
})

router.beforeEach((to, _from: any) => {
  window.$loadingBar && window.$loadingBar.start()
  useTitle((to.meta?.title as string) ?? '(っ´Ι`)っ')
})

router.afterEach((_: any, _from: any, _failure: any) => {
  window.$loadingBar && window.$loadingBar.finish()
})

router.onError(error => {
  window.$loadingBar && window.$loadingBar.finish()
  window.$message.error('路由错误！')
  console.log(error)
})

export { router }
