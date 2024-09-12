<template>
  <div
    class="color-checkbox pos-relative"
    :style="{ backgroundColor: props.color, width: props.width, height: props.height }"
  >
    <Iconify
      v-if="props.themeColor === props.color"
      class="i-ph:pen-light pos-absolute"
      size="20"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  /** 颜色 */
  color: string
  themeColor: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '20px',
  height: '20px',
})
</script>

<style lang="scss" scoped>
.color-checkbox {
  border-radius: 2px;
  cursor: pointer;
  width: 20px;
  height: 20px;
}
</style>
