<template>
  <n-layout class="h-100vh">
    <n-layout-header
      :inverted="app.Layoutinverted"
      bordered
      class="h-67px flex-y-center px-5"
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

      <div class="w-10vw"></div>

      <Menu
        router
        route-path="/console"
        route-name="console"
        mode="horizontal"
      />

      <div class="ml-auto flex-y-center">
        <dialogLogin />
        <setting-drawer />
      </div>
    </n-layout-header>
    <n-layout-content :embedded="app.Layoutinverted">
      <default-layout-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import SettingDrawer from '@/components/setting-drawer/index.vue'
import { DefaultLayoutView } from '@/components/layout-router-view'
import Menu from './components/menu.vue'
import { appStore } from '@/store'
import dialogLogin from '@/views/components/dialog-login.vue'

const app = appStore()
</script>

<style scoped></style>
