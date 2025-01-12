<script setup lang="ts">
import monacoEditor from '@/components/monaco-editor/monaco-editor.vue'
import { useToggle } from '@vueuse/core'
import { ZaiTableV1, useTable, useDialog } from '@/components/zai-table-v1'
import type { DataTableColumns } from 'naive-ui'
import { getJsonFile } from '@/api'
import dayjs from 'dayjs'

interface Row {
  name: string
  update: string
  createDate: string
  size: string
}

const { loading, data, columns } = useTable({
  refresh: async () => {
    const data = await getJsonFile('tabs')
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
</script>

<template>
  <div class="console-content-view">
    <ZaiTableV1
      :loading="loading"
      :data="data"
      :columns="columns"
      :row-key="row => row.name"
    />
  </div>
</template>

<style lang="less" scoped></style>
