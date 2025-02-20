<script setup lang="ts">
// import content from './test-1.vue'
const showModal3 = ref(false)
const files = useTemplateRef('file')
const change = e => {
  console.log('🚀 ~ files.value.files:', files.value.files)
  const img = new Image()
  img.src = URL.createObjectURL(files.value.files[0])
  img.onload = () => {
    console.log('🚀 ~ img.width:', img.width)
  }
}
</script>

<template>
  <!-- <content /> -->
  <div class="demo-content-view">
    <input
      type="file"
      ref="file"
      @change="change"
    />
  </div>
</template>

<style lang="scss" scoped></style>
