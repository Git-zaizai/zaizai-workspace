<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
const fileList = ref<UploadFileInfo[]>([])
</script>

<template>
  <n-upload
    multiple
    directory-dnd
    v-model:file-list="fileList"
    action="http://118.193.47.111/bun-server/file/upload"
    :max="5"
  >
    <n-upload-dragger>
      <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
      <n-p
        depth="3"
        style="margin: 8px 0 0 0"
      >
        请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
      </n-p>
    </n-upload-dragger>
  </n-upload>
</template>

<style lang="scss" scoped></style>
