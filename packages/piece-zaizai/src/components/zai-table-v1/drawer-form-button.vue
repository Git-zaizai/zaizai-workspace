<script setup lang="ts">
const { submitAttrType = 'submit' } = defineProps<{
  submitAttrType?: 'reset' | 'submit' | 'button'
}>()
const emits = defineEmits<{
  submit: [void]
  close: [void]
  reset: [void]
}>()
</script>

<template>
  <div class="w-full">
    <n-button
      block
      :attr-type="submitAttrType"
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
    <n-button
      block
      class="mt-3"
      type="warning"
      ghost
      @click="emits('reset')"
    >
      <template #icon>
        <Iconify class="i-ph-arrows-counter-clockwise-light" />
      </template>
      重置
    </n-button>
  </div>
</template>

<style lang="less" scoped></style>
