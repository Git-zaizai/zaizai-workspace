<template>
  <div class="console-content-view">
    <ZaiTable
      :data="data"
      :columns="columns"
      :column-hides="['default_action_column']"
    />
  </div>
</template>

<script setup lang="ts">
import { ZaiTable } from '@/components/zai-table-v1'
import { h } from 'vue'
import type { DataTableColumns } from 'naive-ui'

import { useTable } from '@/hooks/useTable'

interface RowData {
  key: number
  name: string
  age: number
  address: string
}

const columns: DataTableColumns<RowData> = [
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
    title: 'Row1',
    key: 'row1',
    render(row, index) {
      return h('span', ['row 1', index])
    },
  },
  {
    title: 'Row11',
    key: 'row11',
    render(row, index) {
      return h('span', ['row 11', index])
    },
  },
  {
    title: 'Row12',
    key: 'row12',
    render(row, index) {
      return h('span', ['row 12', index])
    },
  },
  {
    title: 'Row13',
    key: 'row13',
    render(row, index) {
      return h('span', ['row 13', index])
    },
  },
  {
    title: 'Row2',
    key: 'row2',
    render(row, index) {
      return h('span', ['row ', index])
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
]

const { data } = useTable({
  data: Array.from({ length: 100 }).map((_, index) => ({
    key: index,
    name: `Edward King ${index}`,
    age: 32,
    address: `London, Park Lane no. ${index}`,
  })),
})

const handleActionUpdate = row => {
  window.$message.success(`Update ${row.name}`)
}
const handleActionDelete = row => {
  window.$message.warning(`Delete ${row.name}`)
}
</script>

<style scoped></style>
