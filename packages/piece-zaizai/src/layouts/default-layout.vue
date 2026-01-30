<template>
  <n-layout>
    <n-layout-header
      class="h-67px flex-y-center justify-between pr-1"
      bordered
      :inverted="app.Layoutinverted"
    >
      <div class="flex-center">
        <h1 class="pl-3 text-sm lg:text-1.7rem">( *￣▽￣)</h1>
      </div>
      <div class="flex-center gap-3">
        <router-link to="/demo">
          <n-button
            quaternary
            size="small"
          >
            Demo
          </n-button>
        </router-link>

        <router-link to="/console">
          <n-button
            quaternary
            size="small"
          >
            console
          </n-button>
        </router-link>

        <router-link to="/h5-index/h5-hemon">
          <n-button
            quaternary
            size="small"
          >
            H5
          </n-button>
        </router-link>

        <a
          :href="VITE_GITHUB"
          target="_blank"
        >
          <n-button
            quaternary
            size="small"
          >
            GitHub
          </n-button>
        </a>
        <n-text>{{ VITE_APP_VERSION }}</n-text>
        <SettingDrawer />
      </div>
    </n-layout-header>
    <n-layout-content
      content-style="height:calc(100vh - 67px)"
      :embedded="app.Layoutinverted"
    >
      <default-layout-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import SettingDrawer from '@/components/setting-drawer/index.vue'
import { DefaultLayoutView } from '@/components/layout-router-view'

import { appStore } from '@/store'

const app = appStore()
const { VITE_GITHUB, VITE_APP_VERSION } = import.meta.env
</script>

<style scoped></style>
