<template>
  <RouterView v-slot="{ Component, route }">
    <transition
      :name="app.transition.value"
      mode="out-in"
      appear
    >
      <component
        :is="Component"
        :key="route.fullPath"
      />
    </transition>
  </RouterView>
</template>

<script setup lang="ts">
import { appStore } from '@/store'
const app = appStore()
</script>
