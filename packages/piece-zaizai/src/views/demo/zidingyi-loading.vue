<template>
  <div class="p-20px">
    <ZaiLoading v-model:show="is">
      <n-alert
        title="啦啦啦"
        type="success"
      >
        明天再打开行李箱。宝贝，挂电话啦。
      </n-alert>
    </ZaiLoading>
    <n-button @click="toggle()">啦啦啦</n-button>
  </div>
</template>

<script setup lang="ts">
import ZaiLoading from '@/components/zai-loading.vue'

import { useToggle } from '@vueuse/core'

const [is, toggle] = useToggle()
</script>

<style scoped></style>
