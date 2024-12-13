<template>
  <div class="demo-content-view">
    <div>
      <h1>父组件：</h1>

      <div class="flex-col-center">
        content.sum {{ state.sum }}

        <n-button
          type="success"
          @click="state.sum++"
          >点击
        </n-button>
      </div>
    </div>

    <br />
    <div class="h-1 w-full bg-amber"></div>
    <Zi />
  </div>
</template>

<script setup lang="ts">
import { content } from './index'

import Zi from './zi-1.vue'

const { state } = content()
</script>

<style scoped></style>
