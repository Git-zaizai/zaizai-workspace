<template>
  <n-layout>
    <n-layout-header
      class="h-67px flex-center justify-between pr-30px"
      bordered
    >
      <div></div>
      <div class="flex-center gap-3">
        <router-link to="/">
          <n-button
            quaternary
            size="small"
          >
            Demo
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
        <n-text>0.2.7</n-text>
        <SettingDrawer />
      </div>
    </n-layout-header>
    <n-layout-content content-style="height:calc(100vh - 67px)"> </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import SettingDrawer from '@/components/setting-drawer/index.vue'

const { VITE_GITHUB } = import.meta.env
</script>

<style scoped></style>
