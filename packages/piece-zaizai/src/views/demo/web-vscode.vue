<script setup lang="ts">
import monacoEditor from '@/components/monaco-editor'
const show = ref(false)
const monacoValue = ref(`{ "dependencies": {
    "@types/lodash-es": "^4.17.12",
    "@vitejs/plugin-vue": "^5.1.3",
    "@vitejs/plugin-vue-jsx": "^4.1.1",
    "dayjs": "^1.11.13",
    "lodash-es": "^4.17.21",
    "vite": "5.4.3",
    "vue": "^3.5.13"
  }}`)
const name = ref('test.json')
</script>

<template>
  <div>
    <n-button @click="show = !show"> 打开 </n-button>
    <monacoEditor
      v-model:show="show"
      :value="monacoValue"
      :file-name="name"
    />
  </div>
</template>

<style lang="scss" scoped></style>
