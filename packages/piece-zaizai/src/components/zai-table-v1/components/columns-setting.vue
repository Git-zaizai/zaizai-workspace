<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-switch
        size="small"
        :value="shitchValues.selection"
        @update-value="columnSwitch($event, ColumnUID.selection, 'selection')"
      />
    </template>
    多选列
  </n-tooltip>

  <n-tooltip trigger="hover">
    <template #trigger>
      <n-switch
        size="small"
        :value="shitchValues.index_column"
        @update-value="columnSwitch($event, ColumnUID.index_column, 'index_column')"
      />
    </template>
    序号列
  </n-tooltip>

  <n-tooltip trigger="hover">
    <template #trigger>
      <n-switch
        size="small"
        :value="shitchValues.default_action_column"
        @update-value="columnSwitch($event, ColumnUID.default_action_column, 'default_action_column')"
      />
    </template>
    操作列
  </n-tooltip>

  <n-tooltip
    trigger="hover"
    placement="top"
  >
    <template #trigger>
      <div class="flex-y-center">
        <n-popover
          :style="cssVars"
          trigger="click"
          display-directive="show"
          @update-show="onUpdateShow"
        >
          <template #trigger>
            <Iconify
              size="21"
              transition
              class="i-ph:list-star cursor-pointer hover:text-[--zai-primary-color]"
              :class="{
                'text-[--zai-primary-color]': popoverShow,
              }"
              @click="onUpdateShow"
            />
          </template>
          <template #header>
            <div class="flex-y-center justify-between">
              <n-checkbox
                :checked="checkboxAll.checked"
                :indeterminate="checkboxAll.indeterminate"
                @update:checked="checkboxAllChange"
              >
                列设置</n-checkbox
              >
              <n-button
                size="small"
                quaternary
                @click="resetColumn"
              >
                重置
              </n-button>
            </div>
          </template>

          <n-spin :show="spin">
            <VueDraggable
              v-model="columnList"
              handle=".handle"
              class="flex-col gap-3.5"
              @update="deaggableChange"
            >
              <div
                class="flex-y-center handle"
                v-for="(item, index) in columnList"
                :key="item.uid"
              >
                <Iconify
                  class="i-ph:hand-grabbing mr-10px cursor-move"
                  size="21"
                />
                <n-checkbox
                  class="flex-1 mr-3"
                  :checked="item.checked"
                  @update:checked="itemCheckbox($event, index)"
                >
                  {{ item.title }}
                </n-checkbox>

                <n-tooltip
                  trigger="hover"
                  to="body"
                >
                  <template #trigger>
                    <Iconify
                      class="i-line-md:arrow-close-left cursor-pointer hover:text-[--zai-primary-color]"
                      size="16"
                      :class="{
                        'text-[--zai-primary-color]': item.fixed && item.fixed === 'left',
                      }"
                      @click="Pinto('left', item, index)"
                    />
                  </template>
                  固定到左侧
                </n-tooltip>

                <div class="w-1px h-12px bg-[--n-divider-color] mx-3.5"></div>

                <n-tooltip
                  trigger="hover"
                  to="body"
                >
                  <template #trigger>
                    <Iconify
                      class="i-line-md:arrow-close-left flip-horizontal cursor-pointer hover:text-[--zai-primary-color]"
                      size="16"
                      :class="{
                        'text-[--zai-primary-color]': item.fixed && item.fixed === 'right',
                      }"
                      @click="Pinto('right', item, index)"
                    />
                  </template>
                  固定到右侧
                </n-tooltip>
              </div>
            </VueDraggable>
          </n-spin>
        </n-popover>
      </div>
    </template>
    列设置
  </n-tooltip>
</template>

<script setup lang="ts">
import { useCssVars } from '@/hooks/useCssVars'
import { useTableContext, type ZaiTableColumn } from '../hooks/useTableContext'
import { isFunction, isString } from 'lodash-es'
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'
import { ColumnUID } from '../enum'

const cssVars = useCssVars(['primaryColor'])
const columnList = ref([])
const spin = ref(false)
const popoverShow = ref(false)
const { getCacheColumns, setfixed, setColumnShow, columnsSort, columnsome } = useTableContext()

const shitchValues = reactive({
  selection: false,
  index_column: false,
  default_action_column: false,
})

const getTitle = (item: ZaiTableColumn, index: number) => {
  if (item.type === 'selection') {
    return '多选列'
  }
  if (isFunction(item.title)) {
    let { children } = item.title(item) as VNode
    if (isString(children)) return children
  }
  return isString(item.title) ? item.title : `第 ${index} 列`
}

const deaggableChange = (e: DraggableEvent) => {
  if (e.data.checked) {
    columnsSort(columnList.value.filter(fv => fv.checked).map(mv => mv.uid))
  }
}

const onUpdateShow = () => {
  popoverShow.value = !popoverShow.value
}

const checkboxAll = ref({
  indeterminate: false,
  checked: true,
})

const checkboxAllChange = (value: boolean) => {
  checkboxAll.value = {
    indeterminate: false,
    checked: value,
  }
  columnList.value.forEach(v => (v.checked = value))
}

const Pinto = (value: 'left' | 'right', item, index: number) => {
  if (item.fixed === undefined) {
    columnList.value[index].fixed = value
  } else {
    columnList.value[index].fixed = undefined
  }
  setfixed(item.uid, columnList.value[index].fixed)
}

const itemCheckbox = (value: boolean, index: number) => {
  columnList.value[index].checked = value
  setCheckboxAllFn()
  setColumnShow(columnList.value[index].uid as number, value, index)
}

const setCheckboxAllFn = () => {
  let indeterminate = 0

  columnList.value.forEach(v => v.checked && ++indeterminate)
  let leng = columnList.value.length
  if (indeterminate === 0) {
    checkboxAll.value = {
      indeterminate: false,
      checked: false,
    }
  } else if (indeterminate === leng) {
    checkboxAll.value = {
      indeterminate: false,
      checked: true,
    }
  } else if (indeterminate !== leng) {
    checkboxAll.value = {
      indeterminate: true,
      checked: false,
    }
  }
}

const columnSwitch = (e: boolean, uid: number, key: string) => {
  const index = columnList.value.findIndex(fv => fv.uid === uid)
  itemCheckbox(e, index)
  shitchValues[key] = e
}

const resetColumn = () => {
  let list = getCacheColumns().map((item, i) => {
    let checked = columnsome(item.uid)
    return {
      title: getTitle(item, i),
      uid: item.uid,
      fixed: item.fixed,
      checked,
    }
  })

  if (list.length > 20) {
    spin.value = true
    columnList.value = list
    nextTick(() => {
      spin.value = false
    })
  } else {
    columnList.value = list
  }
  setCheckboxAllFn()

  for (const key in shitchValues) {
    let uid = ColumnUID[key]
    shitchValues[key] = columnsome(uid)
  }
}

onMounted(() => {
  resetColumn()
})
</script>

<style scoped>
.flip-horizontal {
  transform: scaleX(-1);
}
</style>
