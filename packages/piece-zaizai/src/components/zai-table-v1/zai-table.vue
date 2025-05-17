<template>
  <div
    class="zai-table"
    ref="zaiTableRef"
    :style="{
      padding: outIn ? '10px' : '0',
    }"
  >
    <div
      class="flex-y-center justify-between pb-3"
      :style="headerStyle"
    >
      <div class="flex-y-center gap-4 w-full">
        <slot name="tableHeaderLeft">
          <n-button
            ghost
            class="header-left__button"
            @click="emits('add')"
          >
            <Iconify class="i-ph:plus-circle-bold" />
          </n-button>
          <n-button
            ghost
            class="header-left__button"
            @click="bandallDelete"
          >
            <Iconify class="i-ph:trash-simple-bold" />
          </n-button>

          <n-input-group class="w-150">
            <n-input
              clearable
              v-model:value="selectValue"
              @clear="emits('selectChanga', '')"
              @keyup.enter="emits('selectChanga', selectValue)"
            />
            <n-button
              ghost
              @click="emits('selectChanga', selectValue)"
            >
              <Iconify class="i-ph:list-magnifying-glass-bold" />
            </n-button>
          </n-input-group>
        </slot>
        <slot name="tableHeaderLeftTail"></slot>
      </div>
      <div class="flex-y-center gap-4">
        <slot name="tableHeaderRightPrefix"></slot>
        <n-tooltip trigger="hover">
          <template #trigger>
            <Iconify
              size="18"
              transition
              @click="emits('refresh')"
              class="i-ph:arrows-counter-clockwise-bold cursor-pointer hover:text-[--zai-primary-color]"
            />
          </template>
          刷新
        </n-tooltip>

        <div class="w-1px h-20px bg-[--zai-border-color]"></div>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Iconify
              size="20"
              transition
              class="i-ph-arrows-in-light cursor-pointer hover:text-[--zai-primary-color]"
              :class="{ 'text-[--zai-primary-color]': tablestriped }"
              @click="bandcancelFullscreen"
              v-if="outIn"
            />
            <Iconify
              size="20"
              transition
              class="i-ph-arrows-out-light cursor-pointer hover:text-[--zai-primary-color]"
              :class="{ 'text-[--zai-primary-color]': tablestriped }"
              @click="bandfullscreen"
              v-else
            />
          </template>
          {{ outIn ? '还原' : '全屏' }}
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Iconify
              size="20"
              transition
              class="i-ph:article cursor-pointer hover:text-[--zai-primary-color]"
              :class="{ 'text-[--zai-primary-color]': tablestriped }"
              @click="tablestriped = !tablestriped"
            />
          </template>
          斑马纹
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Iconify
              size="20"
              transition
              class="i-ph:table cursor-pointer hover:text-[--zai-primary-color]"
              :class="{ 'text-[--zai-primary-color]': !tablebordered }"
              @click="tablebordered = !tablebordered"
            />
          </template>
          边框
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="flex-y-center">
              <n-dropdown
                trigger="click"
                :options="tableDensity"
                @select="densitySelect"
                :value="tableSize"
              >
                <Iconify
                  size="18"
                  transition
                  class="i-ph:arrows-out-line-vertical-fill cursor-pointer hover:text-[--zai-primary-color]"
                />
              </n-dropdown>
            </div>
          </template>
          密度
        </n-tooltip>

        <columnsSetting />
      </div>
    </div>

    <n-data-table
      v-bind="props"
      :columns="columns"
      :data="props.data"
      :pagination="paginationReactive"
      :loading="loading"
      :bordered="tablebordered"
      :scroll-x="scrollautoX"
      :striped="tablestriped"
      :row-key="rowKey"
      :row-props="rowProps"
      @update:checked-row-keys="handleCheck"
      :flex-height="flexHeight"
    />
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownXY.x"
      :y="dropdownXY.y"
      :options="dropdownOptions"
      :show="showDropdownRef"
      :on-clickoutside="onClickoutside"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import columnsSetting from './components/columns-setting.vue'

import { zaiTableProps, type TableRowKey } from './props'
import { createTableContext } from './hooks/useTableContext'
import { useCssVars } from '@/hooks/useCssVars'
import { tableDensity } from './enum'
import { type ZaiTableEmitType, createTableEmitContext } from './hooks/useTableEmits'
import { useKoutSide } from './hooks/useKoutSide'
import type { DataTableRowKey } from 'naive-ui'
import { useToggle } from '@vueuse/core'
import { fullscreen, cancelFullscreen } from '@/utils'
import type { Ref } from 'vue'

const props = defineProps(zaiTableProps)
const emits = defineEmits<ZaiTableEmitType>()

createTableEmitContext(emits)

const headerStyle = useCssVars(['primaryColor', 'borderColor'])
const tablestriped = ref(props.striped ?? false)
const tablebordered = ref(props.bordered ?? true)
const selectValue = defineModel('select', {
  type: String,
  default: '',
})

const tableSize: Ref<'small' | 'medium' | 'large'> = ref(props.size ?? 'medium')
const densitySelect = (key: 'small' | 'medium' | 'large') => {
  tableSize.value = key
}

const { columns, scrollautoX, paginationReactive } = createTableContext(props)

const { dropdownXY, showDropdownRef, rowProps, dropdownOptions, onClickoutside, handleSelect } = useKoutSide(
  emits,
  props.dropdownOption
)

let rowKeyList: DataTableRowKey[] = []
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  rowKeyList = rowKeys
  emits('checkedRows', rowKeys)
}
const bandallDelete = () => {
  if (rowKeyList.length === 0) {
    window.$message.warning(`请选择要删除的行！`)
    return
  }
  emits('del', rowKeyList)
}

const [outIn, outInToggle] = useToggle()
const zaiTableRef = useTemplateRef('zaiTableRef')
const bandfullscreen = async () => {
  if (!outIn.value) {
    try {
      await fullscreen(zaiTableRef.value)
      outInToggle()
    } catch (e) {
      window.$message.warning(e.toString().replace('Error:', ''))
    }
  }
}
const bandcancelFullscreen = () => {
  if (outIn.value) {
    outInToggle()
    cancelFullscreen()
  }
}
</script>

<style scoped>
.zai-table {
  background-color: var(--n-color);
}
.header-left__button :deep(.n-button__border) {
  border: none;
}
</style>
