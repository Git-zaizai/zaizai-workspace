<script setup lang="ts">
const emits = defineEmits<{
  submit: []
  close: []
}>()
</script>

<template>
  <div class="w-full">
    <n-button
      block
      type="primary"
      @click="emits('submit')"
    >
      <template #icon>
        <Iconify class="i-ph:airplane-takeoff" />
      </template>
      提交
    </n-button>
    <n-button
      block
      class="mt-3"
      @click="emits('close')"
    >
      <template #icon>
        <Iconify class="i-line-md-close" />
      </template>
      取消
    </n-button>
  </div>
</template>

<style lang="less" scoped></style>
