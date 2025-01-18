<script setup lang="ts">
import monacoEditor from '@/components/monaco-editor'
import { useToggle } from '@vueuse/core'
import { ZaiTableV1, useTable, useDialog } from '@/components/zai-table-v1'
import type { DataTableColumns } from 'naive-ui'
import { getJsonFile, getJosnList } from '@/api'
import dayjs from 'dayjs'
import { isString } from 'lodash-es'

interface Row {
  name: string
  update: string
  createDate: string
  size: string
}

const [monacoShow, monacoShowToggle] = useToggle()
const monacoValue = ref('')

const { loading, data, columns } = useTable({
  refresh: async () => {
    const data = await getJosnList()
    return data.data.value.data.map(v => {
      v.birthtime = dayjs(v.birthtime).format('YYYY-MM-DD HH:mm:ss')
      v.mtime = dayjs(v.mtime).format('YYYY-MM-DD HH:mm:ss')
      return v
    })
  },
  createColunms: async () => {
    const columns: DataTableColumns<Row> = [
      {
        title: '文件名',
        key: 'name',
      },
      {
        title: '创建时间',
        key: 'birthtime',
      },
      {
        title: '修改时间',
        key: 'mtime',
      },
      {
        title: '文件大小',
        key: 'size',
      },
    ]
    return columns
  },
})

const actionUpdate = async row => {
  const resp = await getJsonFile(row.name)
  if (resp.data.value?.code === 500) {
    window.$message.error(resp.data.value.msg)
  } else {
    monacoValue.value = isString(resp.data.value) ? resp.data.value : JSON.stringify(resp.data.value)
    monacoShowToggle()
  }
}
</script>

<template>
  <div class="console-content-view">
    <ZaiTableV1
      :loading="loading"
      :data="data"
      :columns="columns"
      :row-key="row => row.name"
      @action-update="actionUpdate"
    />

    <monacoEditor
      v-model:show="monacoShow"
      :value="monacoValue"
    />
  </div>
</template>

<style lang="less" scoped></style>
