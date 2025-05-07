<template>
  <n-config-provider
    :theme="theme"
    :locale="zhCN"
    :inline-theme-disabled="inlinethemedisabled"
    :theme-overrides="appProvider.naiveThemeOverrides"
  >
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, darkTheme, lightTheme } from 'naive-ui'
import { appStore } from '@/store'

const inlinethemedisabled = import.meta.env.VITE_INLINE_THEME !== '0'
const appProvider = appStore()
const theme = computed(() => (appProvider.theme === 'light' ? lightTheme : darkTheme))
</script>

<style lang="scss">
@use './styles/globa.scss';
</style>
