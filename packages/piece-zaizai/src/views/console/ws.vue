<script setup lang="tsx">
import { ZaiTableV1, useTable, useDialog } from '@/components/zai-table-v1'
import { Fragment } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import dayjs from 'dayjs'
import { wsSendMessage, wsGetReplyMsg } from '@/api'
import { wait } from '@/utils'

interface Row {
  userid: string
  socketid: string
  messages: string
  createDate: string
  testMsg: string
  testMsgs: Array<{
    sendMsg: string
    replyMessage: string
  }>
}

const { data, columns } = useTable({
  refresh: async () => {
    return new Array(10).fill(0).map((_, index) => {
      return {
        userid: index,
        socketid: 'socketid' + index,
        messages: 'messages',
        createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        testMsg: '',
        testMsgs: [],
      }
    })
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
        key: 'socketid',
      },
      {
        title: '消息列表',
        key: 'messages',
        render: (row, index) => {
          return h(
            NButton,
            {
              onClick: () => (showModal3.value = true),
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

const showModal3 = ref(false)

async function getReplyMsg(msg: string) {
  let i = 0
  const run = async () => {
    const { data } = await wsGetReplyMsg(msg)
    if (data.value && data.value.code === 200) {
      return data.value.data
    } else {
      await wait(1000)
      if (i < 10) {
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
    socketid: row.socketid,
    msg: row.testMsg,
  })

  if (data.value.code !== 200) {
    return window.$message.error(`${data.value.code}：${data.value.msg}`)
  }

  row.testMsgs.push({
    sendMsg: row.testMsg,
    replyMessage: '等待回复...',
  })

  const reply = await getReplyMsg(row.testMsg)
  console.log('🚀 ~ bandSendMessage ~ reply:', reply)
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
      :row-key="row => row.socketid"
      default-expand-all
    />

    <n-modal
      v-model:show="showModal3"
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
