<script setup lang="ts">
import monacoEditor from '@/components/monaco-editor'
import { ZaiTableV1, useTable, useDialog } from '@/components/zai-table-v1'
import type { DataTableColumns } from 'naive-ui'
import { getJsonFile, getJosnList, setJsonFile, delJsonFile } from '@/api'
import dayjs from 'dayjs'
import { isString } from 'lodash-es'
import { useUserStore } from '@/store/user'

interface Row {
  name: string
  update: string
  createDate: string
  size: string
}

const userStore = useUserStore()
const { show, showToggle, bindAddShow, bandUpdateShow, formData, getAction } = useDialog({
  formData: {
    monacoValue: '',
    name: '',
  },
  addCallback: form => {
    formData.value = form
  },
  updateCallback: async row => {
    const resp = await getJsonFile({
      name: row.name,
      code: row.code,
    })
    if (resp.data.value?.code === 500) {
      window.$message.error(resp.data.value.msg)
    } else {
      const updatedFormData = {
        monacoValue: isString(resp.data.value) ? resp.data.value : JSON.stringify(resp.data.value),
        name: row.name,
      }
      return updatedFormData
    }
  },
})

const { loading, data, columns, refresh } = useTable({
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

    if (userStore.info.secretkey) {
      columns.push({
        title: 'code',
        key: 'code',
      })
    }
    return columns
  },
})

const saveJson = async (value: string) => {
  const str = value.replaceAll('\n', '').replaceAll(' ', '')
  let fileName = formData.value.name
  fileName = fileName.endsWith('.json') ? fileName.replace('.json', '') : fileName
  if (getAction() === 'add') {
    fileName = dayjs().format('YYYY-MM-DD-HH-mm-ss')
  }

  const { data } = await setJsonFile(fileName, str)
  if (data.value?.code === 200) {
    window.$message.success('保存成功')
    refresh()
  } else {
    window.$message.error('保存失败')
  }
}

const bandDelete = async (value: Row, index: number) => {
  const d = window.$dialog.warning({
    title: '警告',
    content: '你确定？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      d.loading = true
      const { data, error } = await delJsonFile(
        value.name.endsWith('.json') ? value.name.replace('.json', '') : value.name
      )
      if (error.value) {
        d.loading = false
        return false
      }
      if (data.value?.code === 200) {
        window.$message.success(data.value.msg)
        d.loading = false
        refresh()
      } else {
        window.$message.error(data.value.msg)
        d.loading = false
      }
    },
  })
}
</script>

<template>
  <div class="console-content-view">
    <ZaiTableV1
      :loading="loading"
      :data="data"
      :columns="columns"
      :row-key="row => row.name"
      @action-update="bandUpdateShow"
      @add="bindAddShow"
      @action-delete="bandDelete"
      @refresh="refresh"
    />

    <monacoEditor
      v-model:show="show"
      :value="formData.monacoValue"
      :file-name="formData.name"
      @save="saveJson"
    />
  </div>
</template>

<style lang="less" scoped></style>
