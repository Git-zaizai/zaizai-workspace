<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { copyStr } from '@/utils'
import { useDebounceFn, useToggle } from '@vueuse/core'
import { useDialog, drawerFormButton } from '@/components/zai-table-v1'
import { getLinkTabs, getLinkTable, setLinkItem, addLink, deleteLink } from '@/api'

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

const dropdownOptions: DropdownOption[] = [
  {
    label: '修改',
    key: 'update',
  },
  {
    label: '删除',
    key: 'delete',
  },
]

const dropdown = reactive({
  x: 0,
  y: 0,
  show: false,
})

const tableData = ref<Row[]>([])
const tags = ref([])
const formRef = useTemplateRef('formRef')
let formdataIndex = -1

async function init() {
  const { data } = await getLinkTable()
  tableData.value = data.value.reverse()
  const { data: tagsData } = await getLinkTabs()
  tags.value = tagsData.value
}

onMounted(init)

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

function handleSelect(key) {
  resetClickTimer()
  if (key === 'update') {
    bandUpdateShow(tableData.value[formdataIndex])
  }
  if (key === 'delete') {
    bandUpdateItem('isdel', tableData.value[formdataIndex], formdataIndex)
  }
}

function bandAction(e: PointerEvent, index: number) {
  e.stopPropagation()
  formdataIndex = index
  dropdown.x = e.x
  dropdown.y = e.y
  dropdown.show = true
  clickTimerState.dropdown = true
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

const [copyShow, copyShowToggle] = useToggle()
let clickTimerState: {
  timer: NodeJS.Timeout | null
  el: EventTarget | null
  dropdown: boolean
} = {
  timer: null,
  el: null,
  dropdown: false,
}
function resetClickTimer() {
  clearTimeout(clickTimerState.timer)
  clickTimerState.timer = null
  clickTimerState.el = null
  clickTimerState.dropdown = false
}
function bandContent(item: Row, event: MouseEvent) {
  if (clickTimerState.dropdown) return
  if (clickTimerState.timer && clickTimerState.el === event.target) {
    formData.value = item
    copyShowToggle(true)
    resetClickTimer()
    return
  }
  clickTimerState.el = event.target
  clickTimerState.timer = setTimeout(() => {
    resetClickTimer()
    copyStr(item.title)
  }, 200)
}
</script>

<template>
  <div>
    <div class="page-view p-10">
      <div
        class="flex flex-y-center bg-white rounded-3xl p-x-10 p-y-5 mb-10 last:mb-0"
        v-for="(item, index) in tableData"
        :key="item.id"
      >
        <div class="w-30 flex-center">
          <Iconify
            class="i-ph-android-logo-bold"
            @click="bandAction($event, index)"
            size="26"
          />
        </div>
        <p
          class="w-full ml-15 text-20"
          @click="bandContent(item, $event)"
        >
          {{ item.title }}
        </p>
      </div>
      <div class="h-65"></div>
    </div>

    <footer
      class="h-65 w-full fixed bottom-0 left-0 backdrop-opacity-10 bg-white"
      @click="init"
    >
      <div class="flex-y-center justify-between h-full">
        <div
          class="w-35 h-full"
          @click="bindAddShow"
        ></div>
        <div class="flex-center h-full">
          <Iconify class="i-ph-anchor-bold" />
        </div>
        <div
          class="w-35 h-full"
          @click="bindAddShow"
        ></div>
      </div>
    </footer>

    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdown.x"
      :y="dropdown.y"
      :options="dropdownOptions"
      :show="dropdown.show"
      @clickoutside="dropdown.show = false"
      @select="handleSelect"
    />

    <n-modal
      v-model:show="copyShow"
      display-directive="show"
    >
      <div class="w-90vw bg-white flex-col-center p-y-10 rounded-7px">
        <div class="text-21 m-y-7">嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻</div>
        <div class="text-21 m-y-7">嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻</div>
      </div>
    </n-modal>

    <n-drawer
      v-model:show="show"
      placement="left"
      width="90vw"
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
                  :value="item"
                  :label="item"
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
                <div class="flex flex-col justify-center items-end w-7 5">
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
            class="drawer-form-button"
            @submit="submit"
            @close="showToggle(false)"
            @reset="bindAddShow"
          />
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style lang="scss" scoped>
.page-view {
  height: calc(100vh - 16.25rem);
  background-color: #f5f5f5;
  overflow-y: scroll;
  overflow-x: hidden;
}

.drawer-form-button :deep(.n-button) {
  margin-top: 10px !important;
}
</style>
