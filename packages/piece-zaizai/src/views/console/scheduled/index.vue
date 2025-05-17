<script setup lang="tsx">
import { ZaiTableV1, useTable, useDialog, drawerFormButton } from '@/components/zai-table-v1'
import type { DataTableColumns, FormRules, UploadFileInfo } from 'naive-ui'
import dayjs from 'dayjs'
import {
  getJsonFile,
  getScheduledFileContent,
  getRunFileList,
  scheduleAdd,
  scheduleOpenStart,
  scheduleStop,
  scheduleDelete,
  getRunnerList,
  manualStartTasks,
  updateSchedule,
  getViewTatasks,
  setsaveFile,
} from '@/api'
import { NTag, NButton } from 'naive-ui'
import CustomSizeLoading from '@/components/custom-size-loading.vue'
import { isValidCron } from '@/utils/cron-validator'
import { useToggle } from '@vueuse/core'
import uploadRunFile from './upload-run-file.vue'

interface Row {
  id: string
  createUser: string
  updateUser: string
  title: string
  runfile: string
  cron: string
  logfile: string
  conut: number
  status: 0 | 1 | 2 | 3
  runDate: string
  switch: boolean
  switchLoading: boolean
  createDate: string
  updateDate: string
  runloading: boolean
  executeCommand: string
  testcron: string
}

const runFileReg = /.js|.ts/
const phReg = /\\/g
// 匹配 1.1.1 版本
const regVersion = /\d+(?:\.\d+){2}/

// 辅助函数 从文件路径拿文件名
const getPhFile = (ph: string) => {
  return ph.replace(phReg, '/').split('/').pop()
}

// 状态映射 在上一次运行后得状态
const statusMap = {
  0: () => {
    return (
      <NTag
        round
        bordered={false}
        type="success"
      >
        运行成功
      </NTag>
    )
  },
  1: () => {
    return (
      <NTag
        round
        bordered={false}
        type="info"
      >
        <div class="flex-y-center">
          <CustomSizeLoading
            stroke={'#2080f0'}
            class="mr-2"
          />
          运行中
        </div>
      </NTag>
    )
  },
  2: () => {
    return (
      <NTag
        round
        bordered={false}
        type="error"
      >
        运行失败
      </NTag>
    )
  },
  3: () => {
    return (
      <NTag
        round
        bordered={false}
      >
        从未运行
      </NTag>
    )
  },
}

const {
  loading,
  data: tableData,
  columns,
  refresh,
} = useTable<Row>({
  refresh: async () => {
    const { data, error } = await getJsonFile({
      name: 'scheduled-file.json',
      code: 'data',
    })
    getRunFileOptions()

    return error.value
      ? []
      : data.value.map(v => ({
          ...v,
          runloading: v.status === 1,
          switchLoading: false,
        }))
  },
  createColunms: async () => {
    const columns: DataTableColumns<Row> = [
      {
        title: '任务名称',
        key: 'title',
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: '开启定时任务',
        key: 'switch',
        render: (row: Row) => (
          <n-switch
            value={row.switch}
            rubber-band={false}
            loading={row.switchLoading}
            onUpdateValue={e => switchChange(e, row)}
          ></n-switch>
        ),
      },
      {
        title: 'cron表达式',
        key: 'cron',
      },
      {
        title: '运行次数',
        key: 'conut',
      },
      {
        title: '上次运行状态',
        key: 'status',
        render: (row: Row) => {
          let sum = row.status
          if (row.conut === 0) {
            sum = 3
          }
          return statusMap[sum]()
        },
      },
      {
        title: '上次运行时间',
        key: 'runDate',
        render: (row: Row) => dayjs(row.runDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '运行文件',
        key: 'runfile',
        render: (row: Row) => {
          return (
            <NButton
              text
              title={'打开'}
              onClick={() => openFile(row, 'runfile')}
            >
              {getPhFile(row.runfile)}
            </NButton>
          )
        },
      },
      {
        title: '运行命令',
        ellipsis: {
          tooltip: true,
        },
        key: 'executeCommand',
      },
      {
        title: '日志文件',
        key: 'logfile',
        render: (row: Row) => {
          return (
            <NButton
              text
              title={'查看'}
              onClick={() => openFile(row, 'logfile')}
            >
              {getPhFile(row.logfile)}
            </NButton>
          )
        },
      },
      {
        title: '操作',
        key: 'run_action',
        width: 150,
        render: (row: Row) => {
          return (
            <div class="flex-y-center gap-2">
              <NButton
                loading={row.runloading}
                strong
                secondary
                type="primary"
                onClick={() => runScheduledTasks(row)}
              >
                运行
              </NButton>
            </div>
          )
        },
      },
      {
        title: '修改时间',
        key: 'updateDate',
        render: (row: Row) => dayjs(row.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
    return columns
  },
})

const formRules: FormRules = {
  title: {
    trigger: 'blur',
    message: '请输入',
    required: true,
  },
  cron: [
    {
      trigger: 'blur',
      message: '请输入',
      required: true,
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: string) => {
        if (!isValidCron(value, { seconds: true, allowBlankDay: true, alias: true, allowSevenAsSunday: true })) {
          return Error('cron表达式不正确')
        }
        return true
      },
    },
  ],
  runfile: {
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
}

const { show, showToggle, formData, bindAddShow, actionTitle, getAction, bandUpdateShow } = useDialog({
  formData: {
    id: '',
    createUser: '',
    updateUser: '',
    title: '',
    runfile: undefined,
    runDate: '',
    logfile: '',
    cron: '',
    conut: 0,
    status: 0,
    switch: false,
    createDate: '',
    updateDate: '',
    executeCommand: '',
    switchLoading: false,
    runloading: false,
    testcron: '',
  },
  addCallback: form => {
    formData.value = form
    getRunFileOptions()
    getRunner()
  },
  updateCallback: async item => {
    getRunFileOptions()
    await getRunner()
    let executeCommand: any = item.executeCommand.split(' ')
    executeCommand.pop()
    executeCommand = executeCommand.join(' ')
    if (executeCommand.includes('bun')) {
      runner.value = runnerOptions.value[0].value
    } else {
      let version = executeCommand.match(regVersion)[0]
      const find = runnerOptions.value.find(fv => fv.value.includes(version))
      if (find) {
        runner.value = find.value
      } else {
        runner.value = ''
        window.$message.error('找不到运行器')
      }
    }
    return item
  },
})
const runFileOptions = ref([])
const runnerOptions = ref([])
const runner = ref('')
const formRef = useTemplateRef('formRef')
const logfilePlaceholder = ref('请输入日志文件路径')
const [filecheckShow, filecheckShowToggle] = useToggle(false)

// 选中文件添加默认
watchEffect(() => {
  if (formData.value.runfile) {
    logfilePlaceholder.value = `${getPhFile(formData.value.runfile).replace(runFileReg, '')}.log`
    formData.value.executeCommand = `bun ${formData.value.runfile}`
  }
})

// 监听运行环境切换
watchEffect(() => {
  if (runner.value && formData.value.runfile) {
    let shell = runner.value
    let command = ''
    if (shell.includes('node')) {
      if (shell.includes('default')) {
        command = shell.split('-')[0]
      } else {
        command = `volta run --node ${shell.split('-')[1]} node`
      }
    } else {
      command = `bun`
    }
    formData.value.executeCommand = `${command} ${formData.value.runfile}`
  }
})

async function getRunner() {
  if (runnerOptions.value.length > 0) {
    runner.value = runnerOptions.value[0].value
    return
  }
  const { data, error } = await getRunnerList()
  if (error.value) {
    window.$message.error('获取运行器失败')
    return
  }
  runnerOptions.value = data.value.data.map(item => ({
    label: item,
    value: item,
  }))
  runner.value = runnerOptions.value[0].value
}

async function getRunFileOptions() {
  const { data, error } = await getRunFileList()
  if (!error.value) {
    runFileOptions.value = data.value.data.map(item => ({
      label: item.split('/').pop(),
      value: item,
    }))
  }
}

async function submit() {
  formRef.value.validate(async errors => {
    if (errors) {
      return
    }

    if (getAction() === 'add') {
      const form = {
        title: formData.value.title,
        cron: formData.value.cron,
        runfile: formData.value.runfile,
        logfile: formData.value.logfile,
        executeCommand: formData.value.executeCommand,
        testcron: formData.value.testcron,
      }
      const { data, error } = await scheduleAdd(form)
      if (!error.value) {
        const res = { ...formData.value, ...data.value.data }
        tableData.value.push(res)
        window.$message.success('添加成功')
      }
    } else {
      if (!formData.value.id) {
        return window.$message.error('id为空，不可修改')
      }

      if (formData.value.switch) {
        return window.$message.error('请先关闭任务')
      }
      const form = {
        id: formData.value.id,
        title: formData.value.title,
        runfile: formData.value.runfile,
        cron: formData.value.cron,
        testcron: formData.value.testcron,
        logfile: formData.value.logfile,
        executeCommand: formData.value.executeCommand,
      }
      const { data, error } = await updateSchedule(form)
      if (!error.value) {
        window.$message.success('修改完成')
        const index = tableData.value.findIndex(v => v.id === form.id)

        tableData.value.splice(index, 1, {
          ...data.value.data,
          runloading: data.value.data.status === 1,
          switchLoading: false,
        })
      }
    }
  })
}

async function switchChange(e: boolean, row: Row) {
  row.switchLoading = true

  try {
    const index = tableData.value.findIndex(v => v.id === row.id)
    if (e) {
      const { error } = await scheduleOpenStart({
        id: row.id,
      })
      if (!error.value) {
        tableData.value[index].switch = !row.switch
      }
    } else {
      const { data, error } = await scheduleStop({
        id: row.id,
      })
      if (!error.value) {
        tableData.value[index].switch = !row.switch
        if (data.value.code === 1) {
          window.$message.warning(data.value.msg)
        }
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    setTimeout(() => {
      row.switchLoading = false
    }, 1500)
  }
}

async function runScheduledTasks(row: Row) {
  row.runloading = true
  row.status = 1

  const { data, error } = await manualStartTasks(row.id)
  if (!error.value) {
    if (data.value.data.code === 200) {
      window.$notification.success({
        title: '任务运行成功',
        duration: 5000,
      })
    } else {
      window.$notification.error({
        title: '任务运行失败',
        content: `code: ${data.value.data.code} type: ${data.value.data.type} error: ${data.value.data.msg} err: ${data.value.data.err}`,
      })
    }
    refresh()
  }
}

async function bandscheduleDelete(row, index: number) {
  window.$dialog.create({
    title: '提示',
    type: 'warning',
    content: '确定该删除任务吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      const { error } = await scheduleDelete(row)
      if (!error.value) {
        tableData.value.splice(index, 1)
        window.$message.success('已删除  ' + row.title)
      }
    },
  })
}

const monacoEditorLazy = ref(false)
const monacoState = reactive({
  show: false,
  value: '',
  leng: 'javascript',
  fileName: '',
  filePh: '',
})

async function openFile(row: Row, key: 'runfile' | 'logfile') {
  const load = window.$message.loading('正在打开文件', {
    duration: 0,
  })

  const { data, error } = await getScheduledFileContent(row[key], key)
  if (!error.value) {
    monacoState.filePh = row[key]
    let fileName = getPhFile(row[key])
    if (data.value) {
      monacoState.value = data.value
    } else {
      monacoState.value = ''
      window.$message.warning('请注意文件为空', {
        duration: 3000,
      })
    }
    monacoEditorLazy.value = true
    monacoState.fileName = fileName
    monacoState.leng = key === 'logfile' ? 'log' : fileName.endsWith('.js') ? 'javascript' : 'typescript'
    monacoState.show = true
    setTimeout(() => {
      load.destroy()
    }, 500)
  } else {
    load.destroy()
  }
}

function openRunFile() {
  const req = {
    runfile: formData.value.runfile,
  }
  openFile(req as Row, 'runfile')
}

async function viewTatasks() {
  const { data, error } = await getViewTatasks()
  if (!error.value) {
    window.$notification.success({
      title: '当前任务数量',
      content: `${data.value.data} 个`,
      duration: 0,
    })
  }
}

async function saveFile(str: string) {
  const { data, error } = await setsaveFile({
    ph: monacoState.filePh,
    content: str,
  })
  if (!error.value) {
    window.$message.success('保存成功')
  }
}
</script>

<template>
  <div class="console-content-view">
    <ZaiTableV1
      :data="tableData"
      :columns="columns"
      :row-key="row => row._id"
      :loading="loading"
      @refresh="refresh"
      @add="bindAddShow"
      @action-delete="bandscheduleDelete"
      @action-update="bandUpdateShow"
    >
      <template #tableHeaderLeftTail>
        <div class="flex-y-center gap-3">
          <n-button
            ghost
            @click="() => filecheckShowToggle()"
          >
            <Iconify class="i-ph-file-plus-duotone" />
          </n-button>

          <n-button
            ghost
            @click="viewTatasks"
          >
            <Iconify class="i-ph-eyes mr-1" />
            查看当前任务数
          </n-button>
        </div>
      </template>
    </ZaiTableV1>

    <n-drawer
      v-model:show="show"
      placement="left"
      width="30vw"
      :trap-focus="false"
    >
      <n-drawer-content
        :title="actionTitle"
        :native-scrollbar="false"
      >
        <n-form
          ref="formRef"
          :rules="formRules"
          :model="formData"
        >
          <n-form-item
            label="任务名称："
            path="title"
          >
            <n-input
              v-model:value="formData.title"
              clearable
              placeholder="请输入任务名称"
            />
          </n-form-item>
          <n-form-item
            label="cron表达式："
            path="cron"
          >
            <n-input
              v-model:value="formData.cron"
              placeholder="请输入cron表达式 * * * * * *"
            />
          </n-form-item>
          <n-form-item
            label="cron表达式（测试环境）："
            path="testcron"
          >
            <n-input
              v-model:value="formData.testcron"
              placeholder="请输入cron表达式 * * * * * *"
            />
          </n-form-item>
          <n-form-item
            label="运行文件："
            path="runfile"
          >
            <div class="flex-col w-full">
              <n-select
                :options="runFileOptions"
                clearable
                filterable
                v-model:value="formData.runfile"
              ></n-select>
              <n-button
                v-if="formData.runfile"
                class="mt-3"
                @click="openRunFile"
                >打开文件</n-button
              >
            </div>
          </n-form-item>

          <n-form-item
            label="运行器（运行环境）："
            path="runner"
          >
            <div class="flex-col w-full">
              <n-select
                :options="runnerOptions"
                clearable
                filterable
                v-model:value="runner"
                :disabled="!formData.runfile"
              ></n-select>
            </div>
          </n-form-item>

          <n-form-item
            label="运行命令："
            path="executeCommand"
          >
            <n-input
              v-model:value="formData.executeCommand"
              clearable
              type="textarea"
              :disabled="!formData.runfile"
              placeholder="请输入运行命令"
            />
          </n-form-item>

          <n-form-item
            label="日志文件："
            path="logfile"
          >
            <n-input
              v-model:value="formData.logfile"
              clearable
              :placeholder="logfilePlaceholder"
            />
          </n-form-item>

          <drawerFormButton
            @reset="bindAddShow"
            @submit="submit"
            @close="showToggle(false)"
          />
        </n-form>
      </n-drawer-content>
    </n-drawer>

    <LazyMonacoEditor
      :lazy="monacoEditorLazy"
      v-model:show="monacoState.show"
      :value="monacoState.value"
      :leng="monacoState.leng"
      :fileName="monacoState.fileName"
      @save="saveFile"
    />

    <upload-run-file
      v-model:show="filecheckShow"
      :runFileOptions="runFileOptions"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.upload-run-file) {
  .n-upload-file-list {
    overflow-y: scroll;
    max-height: 244px;

    &::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }
    &::-webkit-scrollbar-corner,
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--zai-scrollbar-color);
      border-radius: 4px;
    }
    &::-webkit-scrollbar-corner,
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
}
</style>
