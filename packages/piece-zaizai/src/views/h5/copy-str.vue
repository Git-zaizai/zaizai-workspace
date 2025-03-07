<script setup lang="ts">
import { setCopyStr, getCopyList, clearStrFile } from '@/api'
import { copyStr } from '@/utils'
const copystr = ref<any>()
const inputStatus = ref<'success' | 'error' | 'warning'>('success')
const copyList = ref([])

async function sendStr() {
  if (copystr.value === '') {
    inputStatus.value = 'warning'
    return
  } else {
    inputStatus.value = 'success'
  }

  try {
    await setCopyStr(copystr.value)
    copyList.value.unshift(copystr.value)
  } catch {
    window.$message.error('发送失败，请重试')
  }
}

function clearStr() {
  window.$dialog.create({
    title: '提示',
    content: '确定清空吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      const { error } = await clearStrFile()
      if (!error.value) {
        copyList.value = []
      }
    },
  })
}

onMounted(async () => {
  try {
    const res = await getCopyList()
    copyList.value = res.data.value.split('\n').reverse()
  } catch {
    window.$message.error('获取失败，请重试')
  }
})
</script>

<template>
  <div class="h5-page-height p-5 p-t-10">
    <n-input
      v-model:value="copystr"
      type="textarea"
      :status="inputStatus"
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
    <n-button
      class="mt-5"
      block
      @click="clearStr"
      >清空</n-button
    >

    <Iconify class="i-ph-arrow-bend-down-left-thin" />

    <div class="mt-20">
      <p
        class="text-16px m-y-10"
        v-for="(v, i) in copyList"
        :key="i"
        @click="copyStr(v)"
      >
        {{ v }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
