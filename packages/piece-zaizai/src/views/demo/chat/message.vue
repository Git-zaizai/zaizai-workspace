<script setup lang="ts">
const { content = '' } = defineProps<{
  content: string
}>()
</script>

<template>
  <div class="VPDoc">
    <div class="p-10px">
      <div class="vp-doc">
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
