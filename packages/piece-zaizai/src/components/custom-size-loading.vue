<script setup lang="ts">
const { size = '15px' } = defineProps<{
  size?: `${string}px`
  stroke?: string
  description?: string
}>()
const show = defineModel('show', {
  type: Boolean,
  default: true,
})
</script>

<template>
  <n-spin
    v-if="show"
    :stroke="stroke"
    :description="description"
  >
  </n-spin>
</template>

<style lang="scss" scoped>
:deep(.n-base-loading) {
  width: v-bind(size);
  height: v-bind(size);
}

:deep(.n-base-loading .n-base-loading__container) {
  animation: none;
}

:deep(.n-base-loading .n-base-loading__container .n-base-loading__icon) {
  width: v-bind(size);
  height: v-bind(size);
}
</style>
