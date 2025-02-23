<template>
  <div class="console-content-view">
    <ZaiTableV1
      :data="tableData"
      :columns="columns"
      :row-key="row => row._id"
      :loading="loading"
      @add="bindAddShow"
      @action-update="bandUpdateShow"
      @refresh="refresh"
      @select-changa="bandSelect"
      @action-delete="bandUpdateItem('isdel', $event, 0)"
    />

    <n-drawer
      v-model:show="show"
      placement="left"
      width="30vw"
    >
      <n-drawer-content
        :title="actionTitle"
        :native-scrollbar="false"
      >
        <n-form
          ref="formRef"
          :model="formData"
        >
          <n-form-item
            label="小说名:"
            path="title"
            :rule="rule"
          >
            <n-input
              placeholder="小说名"
              clearable
              v-model:value="formData.title"
            />
          </n-form-item>

          <n-form-item label="读到那章:">
            <n-input-group>
              <n-input-number
                v-model:value="formData.start"
                class="text-align flex-1"
                button-placement="both"
              />
              <n-input-group-label>--</n-input-group-label>
              <n-input-number
                v-model:value="formData.finish"
                class="text-align flex-1"
                button-placement="both"
              />
            </n-input-group>
          </n-form-item>

          <n-form-item label="读完：">
            <n-radio-group
              v-model:value="formData.duwan"
              name="radiogroup"
            >
              <n-space>
                <n-radio-button
                  :value="1"
                  label="读完"
                />
                <n-radio-button
                  :value="0"
                  label="未读完"
                />
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item label="标签：">
            <n-checkbox-group v-model:value="formData.tabs">
              <n-space>
                <n-checkbox
                  v-for="item in tags"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </n-form-item>

          <n-form-item label="完结/连载：">
            <n-radio-group
              v-model:value="formData.wanjie"
              name="radiogroup"
            >
              <n-space>
                <n-radio-button
                  :value="1"
                  label="完结"
                />
                <n-radio-button
                  :value="0"
                  label="连载"
                />
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item label="删除状态：">
            <n-radio-group
              v-model:value="formData.isdel"
              name="radiogroup"
            >
              <n-space>
                <n-radio-button
                  :value="1"
                  label="显示"
                />
                <n-radio-button
                  :value="0"
                  label="隐藏"
                />
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item label="首链接:">
            <n-input
              placeholder=""
              clearable
              v-model:value="formData.link"
            />
          </n-form-item>

          <n-form-item label="后续链接:">
            <n-input
              placeholder=""
              clearable
              v-model:value="formData.linkback"
            />
          </n-form-item>

          <n-form-item label="备注：">
            <n-input
              placeholder="备注"
              type="textarea"
              clearable
              v-model:value="formData.beizhu"
            />
          </n-form-item>

          <n-form-item label="评分:">
            <n-input
              placeholder=""
              clearable
              v-model:value="formData.rate"
            />
          </n-form-item>

          <div
            class="links"
            v-for="(linkItem, linki) in formData.links"
            :key="linki"
          >
            <transition
              name="fade-scale"
              mode="out-in"
              appear
            >
              <div class="flex">
                <div class="flex-1">
                  <n-form-item :label="linkItem.linkName ? linkItem.linkName : `${linki + 1}、链接名：`">
                    <n-input
                      placeholder="链接名"
                      clearable
                      v-model:value="linkItem.linkName"
                    />
                  </n-form-item>
                  <n-form-item label="URL:">
                    <n-input
                      placeholder="URL"
                      clearable
                      v-model:value="linkItem.url"
                    />
                  </n-form-item>
                </div>
                <div class="flex flex-col justify-center items-end w-15">
                  <n-button
                    @click="bindRemoveLink(linki)"
                    type="warning"
                    strong
                    secondary
                  >
                    <template #icon>
                      <Iconify class="i-ph-x-square" />
                    </template>
                  </n-button>
                </div>
              </div>
            </transition>
          </div>

          <n-button
            block
            class="mb-5"
            @click="bandaddLinks"
          >
            <Iconify class="i-ph-plus-circle" />
          </n-button>

          <drawerFormButton
            @submit="submit"
            @close="showToggle(false)"
            @reset="bindAddShow"
          />
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="tsx">
import { ZaiTableV1, useTable, useDialog, drawerFormButton } from '@/components/zai-table-v1'
import type { DataTableColumns } from 'naive-ui'
import { copyStr } from '@/utils'
import { NTag, NSpace, NButton } from 'naive-ui'
import dayjs from 'dayjs'
import { random } from 'lodash-es'
import { getLinkTabs, getLinkTable, setLinkItem, addLink, deleteLink } from '@/api'
import Iconify from '@/components/Iconify.vue'

interface Row {
  title: string
  start: number
  finish: number
  duwan: number
  tabs: string[]
  wanjie: number
  isdel: number
  link: string
  linkback: string
  beizhu: string
  links: Array<{
    linkName: string
    url: string
  }>
  addDate: string
  update: string
  finishtime: string
  rate: string
  id: string
}

function randTagType() {
  const list = ['default', 'success', 'error', 'warning', 'primary', 'info']
  return list[random(0, list.length)] as TagType
}

const rule = {
  trigger: 'blur',
  required: true,
  validator(_, val: string) {
    if (val === '') {
      return new Error('不能为空')
    }
    if (getAction() === 'add' && tableData.value.some(v => v.title === val)) {
      return new Error('小说名不能相同')
    }
    return true
  },
}

const { show, showToggle, getAction, setAction, bindAddShow, bandUpdateShow, actionTitle, formData } = useDialog({
  formData: {
    title: '',
    start: 0,
    finish: 0,
    duwan: 1,
    tabs: [],
    wanjie: 1,
    isdel: 1,
    link: '',
    linkback: '',
    beizhu: '',
    links: [],
    addDate: null,
    update: null,
    finishtime: null,
    rate: '',
    id: '',
  },
  addCallback: form => {
    formData.value = form
  },
  updateCallback: item => {
    return item
  },
})

const tags = ref([])

const {
  loading,
  data: tableData,
  columns,
  refresh,
  getCacheData,
} = useTable<Row>({
  refresh: async () => {
    const { data, error } = await getLinkTable()
    if (!error.value) {
      return data.value.reverse()
    }
  },
  createColunms: async () => {
    const { data } = await getLinkTabs()

    const tabOptions = data.value?.map(item => ({ label: item, value: item }))
    tags.value = tabOptions
    const columns: DataTableColumns<Row> = [
      {
        title: '小说名',
        key: 'title',
        width: 200,
        fixed: 'left',
      },
      {
        title: '首页链接',
        key: 'link',
        render(row) {
          return (
            <n-button
              strong
              tertiary
              size={'small'}
              onClick={() => copyStr(row.link as string)}
            >
              {row.link ? '复制' : '无'}
            </n-button>
          )
        },
        width: 90,
      },
      {
        title: '备注',
        key: 'beizhu',
        ellipsis: {
          tooltip: true,
        },
        width: 120,
      },
      {
        title: '读完',
        key: 'duwan',
        render(row, index) {
          return (
            <n-button
              type={row.duwan ? 'success' : 'warning'}
              strong
              secondary
              size={'small'}
              onClick={() => bandUpdateItem('duwan', row, index)}
            >
              {row.duwan ? '读完' : '未读完'}
            </n-button>
          )
        },
        width: 90,
        // @ts-ignore
        sorter: 'default',
      },

      {
        title: '标签',
        key: 'tabs',
        render(row: any) {
          return (
            <NSpace>
              {row.tabs.map(item => (
                <NTag
                  bordered={false}
                  type={randTagType()}
                >
                  {item}
                </NTag>
              ))}
            </NSpace>
          )
        },
        minWidth: 500,
        filterOptions: tabOptions,
        filter(
          value: string,
          {
            tabs,
          }: {
            tabs: string[]
          }
        ) {
          return tabs.includes(value)
        },
      },

      {
        title: '完结/连载',
        key: 'wanjie',
        render(row) {
          return (
            <NTag
              bordered={false}
              type="info"
            >
              {row.wanjie == 1 ? '完结' : '连载'}
            </NTag>
          )
        },
        width: 110,
        // @ts-ignore
        sorter: 'default',
      },
      {
        title: '删除状态',
        key: 'isdel',
        render(row, index) {
          return (
            <n-button
              type={row.isdel ? 'success' : 'warning'}
              strong
              secondary
              size={'small'}
              onClick={() => bandUpdateItem('isdel', row, index)}
            >
              {row.isdel ? '显示' : '隐藏'}
            </n-button>
          )
        },
        width: 110,
        // @ts-ignore
        sorter: 'default',
      },
      {
        title: '读到那章',
        key: 'start-finish',
        render: row => `${row.start} - ${row.finish}`,
        width: 90,
      },
      {
        title: '后续链接',
        key: 'linkback',
        render(row) {
          return (
            <n-button
              strong
              tertiary
              size={'small'}
              onClick={() => copyStr(row.linkback as string)}
            >
              {row.linkback ? '复制' : '无'}
            </n-button>
          )
        },
        width: 90,
      },

      {
        title: '其他链接',
        key: 'links',
        render(row: any) {
          if (!row.links.length) {
            return (
              <NTag
                bordered={false}
                type={'default'}
              >
                无
              </NTag>
            )
          }
          return row.links.map(item => (
            <n-button
              strong
              tertiary
              size={'small'}
              onClick={() => copyStr(item.urli)}
            >
              {item.linkName}
            </n-button>
          ))
        },
        width: 90,
      },

      {
        title: '添加时间',
        key: 'addDate',
        render: row => dayjs(row.addDate).format('YYYY-MM-DD HH:mm:ss'),
        width: 160,
      },
      {
        title: '修改时间',
        key: 'update',
        render: row => dayjs(row.update).format('YYYY-MM-DD HH:mm:ss'),
        width: 160,
      },
      {
        title: '看完时间',
        key: 'finishtime',
        render: row => dayjs(row.finishtime).format('YYYY-MM-DD HH:mm:ss'),
        width: 160,
      },
      {
        title: '评分',
        key: 'rate',
        /* render: (row: any) => {
          if (!row.rate.length) {
            return (
              <NTag
                bordered={false}
                type={'default'}
              >
                无
              </NTag>
            )
          }
          return row.rate.map(item => (
            <NTag
              bordered={false}
              type={'default'}
            >
              {item}
            </NTag>
          ))
        }, */
      },
      {
        title: '彻底删除',
        key: 'completelyDelete',
        render(row, index) {
          return (
            <n-popconfirm
              onPositiveClick={() => {
                console.log('asdasdas')
                handlePositiveClick(row, index)
              }}
            >
              {{
                trigger: () => (
                  <n-button
                    size={'small'}
                    type={'error'}
                    ghost={true}
                  >
                    彻底删除
                  </n-button>
                ),
                default: () => '确定要删除吗？',
              }}
            </n-popconfirm>
          )
        },
      },
    ]
    return columns
  },
})

async function bandUpdateItem(key: 'duwan' | 'wanjie' | 'isdel', row: Row, index: number) {
  let itemValue = row[key]
  let newValue = Number(itemValue) === 0 ? 1 : 0

  const { data } = await setLinkItem({ id: row.id, data: { [key]: newValue } })
  if (data.value.code === 200) {
    row[key] = newValue
    window.$message.success(data.value.msg)
  } else {
    window.$message.error(`${data.value.code}: ${data.value.msg}`)
  }
}

function bindRemoveLink(index) {
  formData.value.links.splice(index, 1)
}

function bandaddLinks() {
  formData.value.links.push({
    linkName: '',
    url: '',
  })
}

const formRef = useTemplateRef('formRef')

async function submit() {
  formRef.value.validate(async errors => {
    if (!errors) {
      if (getAction() === 'add') {
        const { data } = await addLink(formData.value)
        if (data.value.code === 200) {
          tableData.value.unshift(data.value.data)
          formData.value = data.value.data
          setAction('update')
        } else {
          window.$message.error(`${data.value.code}: ${data.value.msg}`)
        }
      } else {
        const { data } = await setLinkItem({ id: formData.value.id, data: formData.value })
        if (data.value.code === 200) {
          const index = tableData.value.findIndex(fv => fv.id === formData.value.id)
          tableData.value[index] = formData.value
          window.$message.success(data.value.msg)
        } else {
          window.$message.error(`${data.value.code}: ${data.value.msg}`)
        }
      }
    }
  })
}

function bandSelect(value) {
  if (value === '') {
    tableData.value = getCacheData()
    return
  }
  tableData.value = tableData.value.filter(item => item.title.includes(value))
}

async function handlePositiveClick(row: Row, index) {
  const { data } = await deleteLink({ id: row.id })
  if (data.value.code === 200) {
    tableData.value.splice(index, 1)
    window.$message.success('已删除！')
  }
}
</script>

<style scoped></style>
