<template>
  <RouterView v-slot="{ Component, route }">
    <transition
      :name="app.transition.value"
      mode="out-in"
      appear
    >
      <keep-alive v-bind="props">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </keep-alive>
    </transition>
  </RouterView>
</template>

<script setup lang="ts">
import { appStore } from '@/store'
import type { KeepAliveProps } from 'vue'

const props = defineProps<Required<KeepAliveProps>>()

const app = appStore()
</script>
