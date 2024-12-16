<template>
  <div class="demo-content-view">
    <ZaiTableV1
      :data="data"
      :columns="columns"
      @action-update="handleActionUpdate"
      @action-delete="handleActionDelete"
      :min-height="'calc(100vh - 170px)'"
    />
  </div>
</template>

<script setup lang="ts">
import { ZaiTableV1 } from '@/components/zai-table-v1'
import { h } from 'vue'
import type { DataTableColumns } from 'naive-ui'

import { Component } from 'vue'

interface RowData {
  key: number
  name: string
  age: number
  address: string
}

const columns: any[] = [
  {
    title: 'Name',
    key: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: 'Age',
    key: 'age',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'Row',
    key: 'row',
    render(row, index) {
      return h('span', ['row ', index])
    },
  },
  {
    title: 'Row2',
    key: 'Row2',
    render(row, index) {
      return h('span', ['Row2 ', index])
    },
  },
  {
    title: 'Row3',
    key: 'Row3',
    render(row, index) {
      return h('span', ['Row3 ', index])
    },
  },
  {
    title: 'Row4',
    key: 'Row4',
    render(row, index) {
      return h('span', ['Row4 ', index])
    },
  },
  {
    title: 'Row5',
    key: 'Row5',
    render(row, index) {
      return h('span', ['Row5', index])
    },
  },
  {
    title: 'Row6',
    key: 'Row6',
    render(row, index) {
      return h('span', ['Row6 ', index])
    },
    width: 100,
    fixed: 'right',
  },
  {
    title: 'Address',
    key: 'address',
    width: 200,
    fixed: 'right',
  },
].slice(0, 3)

const dataitem = columns.map(col => col.key)
const data = Array.from({ length: 100 }).map((_, index) => {
  let obj = {}
  dataitem.forEach(item => {
    obj[item] = `${item} + ${index} ==> ${index * 2}`
  })
  return obj as RowData
})

const handleActionUpdate = row => {
  window.$message.success(`Update ${row.name}`)
}
const handleActionDelete = row => {
  window.$message.warning(`Delete ${row.name}`)
}
</script>

<style scoped></style>
