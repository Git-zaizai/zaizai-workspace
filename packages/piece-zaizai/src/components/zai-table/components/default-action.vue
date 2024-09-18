<template>
  <div class="flex-y-center gap-2">
    <n-button
      quaternary
      type="primary"
      @click="edit"
      size="small"
    >
      <template #icon>
        <Iconify class="i-ph:pencil-bold" />
      </template>

      编辑
    </n-button>
    <n-popconfirm
      v-if="deletePopconfirmShow"
      @positive-click="onDelete"
      @negative-click="onDelete"
    >
      <template #trigger>
        <n-button
          quaternary
          type="error"
          size="small"
        >
          <template #icon>
            <Iconify class="i-ph:trash-bold" />
          </template>
          删除
        </n-button>
      </template>
      确定删除该记录吗？
    </n-popconfirm>
    <n-button
      v-else
      quaternary
      type="error"
      @click="onDelete"
      size="small"
    >
      <template #icon>
        <Iconify class="i-ph:trash-bold" />
      </template>
      删除
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useTableEmits } from '../hooks/useTableEmits'
import { useTableContext } from '../hooks/useTableContext'

const props = defineProps<{
  row: any
  index: number
}>()

const emits = useTableEmits()
const { deletePopconfirmShow } = useTableContext()

const edit = () => {
  emits('actionUpdate', props.row, props.index)
}

const onDelete = () => {
  emits('actionDelete', props.row, props.index)
}
</script>

<style scoped></style>
