<script setup lang="ts">
import { setCopyStr, getCopyList } from '@/api'
const copystr = ref('')
const inputStatus = ref('')
const copyList = ref([])

async function sendStr() {
  if (copystr.value === '') {
    inputStatus.value = 'warning'
    return
  } else {
    inputStatus.value = ''
  }

  try {
    await setCopyStr(copystr.value)
    copyList.value.push(copystr.value)
  } catch {
    window.$message.error('发送失败，请重试')
  }
}
</script>

<template>
  <div class="h5-page-height p-5 p-t-10">
    <n-input
      v-model:value="copystr"
      type="textarea"
      clearable
      @keyup.center="sendStr"
      :autosize="{ minRows: 5 }"
    />
    <p
      v-if="inputStatus === 'warning'"
      class="mt-5 text-red"
    >
      请出入文字
    </p>
    <n-button
      class="mt-5"
      block
      @click="sendStr"
      >发送</n-button
    >
    
    <Iconify class="i-ph-arrow-bend-down-left-thin" />

    <!-- <div class="mt-20">
      <p class="text-20 m-y-10">https://tool.h234.cn/rcode/h234/h234/h234/h234/h234index.html</p>
     
    </div> -->
  </div>
</template>

<style lang="scss" scoped></style>
