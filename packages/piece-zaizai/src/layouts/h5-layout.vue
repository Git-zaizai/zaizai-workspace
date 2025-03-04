<script setup lang="ts">
import { DefaultLayoutView } from '@/components/layout-router-view'
import { appStore } from '@/store'
import dialogLogin from '@/views/components/dialog-login.vue'

const app = appStore()
function setRem() {
  // 1920 默认大小16px; 1920px = 120rem ;每个元素px基础上/16
  const screenWidth = 1920
  const scale = screenWidth / 16
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth // 得到html的Dom元素
  const htmlDom = document.getElementsByTagName('html')[0] // 设置根元素字体大小
  htmlDom.style.fontSize = htmlWidth / scale + 'px'
} // 初始化

onMounted(() => {
  setRem() // 改变窗口大小时重新设置 rem
})
</script>

<template>
  <div>
    <n-layout class="h-100vh">
      <n-layout-header
        :inverted="app.Layoutinverted"
        bordered
        class="h-5.5vh flex-y-center px-5 h5-header"
      >
        <router-link
          to="/"
          class="flex-y-center"
        >
          <img
            src="@/assets/logo.png"
            class="h-40px w-40px ml-3"
          />
        </router-link>

        <div class="ml-auto flex-y-center">
          <dialogLogin />
          <setting-drawer />
        </div>
      </n-layout-header>
      <n-layout-content :embedded="app.Layoutinverted">
        <default-layout-view />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style lang="scss" scoped>

</style>
