<script setup lang="tsx">
import { ZaiTableV1, useTable, useDialog } from '@/components/zai-table-v1'
import { Fragment } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import dayjs from 'dayjs'
import { wsSendMessage, wsGetReplyMsg, wsGetList } from '@/api'
import { wait } from '@/utils'
import { useToggle } from '@vueuse/core'

interface Row {
  userid: string
  socketId: string
  messages: string
  createDate: string
  testMsg: string
  testMsgs: Array<{
    sendMsg: string
    replyMessage: string
  }>
}

const [showModal, showModalToggle] = useToggle()

const { data, columns, refresh } = useTable({
  refresh: async () => {
    const { data } = await wsGetList()
    return data.value && data.value.data.map(v => ({ ...v, testMsg: [], testMsgs: [] }))
  },
  createColunms: async () => {
    const columns: DataTableColumns<Row> = [
      {
        type: 'expand',
        renderExpand: rowData => {
          return (
            <div class="flex-col">
              <div class="flex">
                <n-input
                  style={{ width: '80%' }}
                  class="mr-2"
                  value={rowData.testMsg}
                  onUpdate:value={(value: string) => {
                    rowData.testMsg = value
                  }}
                  onKeypress={(e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      bandSendMessage(rowData)
                    }
                  }}
                />
                <n-button
                  class="w-25%"
                  type={'primary'}
                  onClick={() => bandSendMessage(rowData)}
                >
                  发送
                </n-button>
              </div>

              <n-descriptions
                label-placement="left"
                columns={2}
                class="mt-3"
              >
                {rowData.testMsgs.map((item, index) => (
                  <>
                    <n-descriptions-item label="你发送的">{item.sendMsg}</n-descriptions-item>
                    <n-descriptions-item label="回复">{item.replyMessage}</n-descriptions-item>
                  </>
                ))}
              </n-descriptions>
            </div>
          )
        },
      },
      {
        title: '用户自定义名称',
        key: 'userid',
      },
      {
        title: 'Socket ID',
        key: 'socketId',
      },
      {
        title: '消息列表',
        key: 'messages',
        render: (row, index) => {
          return h(
            NButton,
            {
              onClick: () => showModalToggle(),
            },
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

async function getReplyMsg(form: { socketId: string; msg: string }) {
  let i = 0
  const run = async () => {
    const { data } = await wsGetReplyMsg(form)
    if (data.value && data.value.code === 200) {
      return data.value.data
    } else {
      await wait(1000)
      if (i < 9) {
        i++
        return run()
      }
    }
  }
  return run()
}

async function bandSendMessage(row: Row) {
  if (!row.testMsg) {
    window.$message.warning('请传入文字!')
    return
  }

  const { data } = await wsSendMessage({
    socketId: row.socketId,
    msg: row.testMsg,
  })

  if (data.value.code !== 200) {
    return window.$message.error(`${data.value.code}：${data.value.msg}`)
  }

  row.testMsgs.push({
    sendMsg: row.testMsg,
    replyMessage: '等待回复...',
  })

  const reply = await getReplyMsg({
    msg: row.testMsg,
    socketId: row.socketId,
  })
  if (!reply) {
    row.testMsgs.at(-1).replyMessage = '无回复'
  } else {
    row.testMsgs.at(-1).replyMessage = reply
  }
}
</script>

<template>
  <div class="console-content-view">
    <ZaiTableV1
      :data="data"
      :columns="columns"
      :row-key="row => row.socketId"
      default-expand-all
      @refresh="refresh"
    />

    <n-modal
      v-model:show="showModal"
      title="无预设拖拽"
      draggable
      :style="{ width: '800px' }"
    >
      <template #default="{ draggableClass }">
        <n-card>
          <div :class="draggableClass">点我拖拽</div>
        </n-card>
      </template>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>
