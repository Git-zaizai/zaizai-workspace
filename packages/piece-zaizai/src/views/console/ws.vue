<script setup lang="ts">
import { ZaiTableV1, useTable, useDialog } from '@/components/zai-table-v1'
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import dayjs from 'dayjs'

interface Row {
  userid: string
  socketid: string
  messages: string
  createDate: string
}

const { data, columns } = useTable({
  refresh: async () => {
    return new Array(10).fill(0).map((_, index) => {
      return {
        userid: index,
        socketid: 'socketid' + index,
        messages: 'messages',
        createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
    })
  },
  createColunms: async () => {
    const columns: DataTableColumns<Row> = [
      {
        type: 'expand',
        renderExpand: rowData => {
          return rowData.userid
        },
      },
      {
        title: '用户自定义名称',
        key: 'userid',
      },
      {
        title: 'Socket ID',
        key: 'socketid',
      },
      {
        title: '消息列表',
        key: 'messages',
        render: (row, index) => {
          return h(
            NButton,
            {},
            {
              default: () => '查看',
            }
          )
        },
      },
      {
        title: '创建时间',
        key: 'createDate',
      },
    ]
    return columns
  },
})
</script>

<template>
  <div class="console-content-view">
    <ZaiTableV1
      :data="data"
      :columns="columns"
      :row-key="row => row.socketid"
      default-expand-all
    />
  </div>
</template>

<style lang="scss" scoped></style>
