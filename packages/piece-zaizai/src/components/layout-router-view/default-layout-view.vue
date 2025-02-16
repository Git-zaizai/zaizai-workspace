<template>
  <RouterView v-slot="{ Component, route }">
    <transition
      :name="app.transition.value"
      mode="out-in"
      appear
    >
      <Suspense>
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </Suspense>
    </transition>
  </RouterView>
</template>

<script setup lang="ts">
import { appStore } from '@/store'
const app = appStore()
</script>
