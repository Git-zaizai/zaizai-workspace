<template>
  <div class="zai-table">
    <div
      class="flex-y-center justify-between pb-3"
      :style="headerStyle"
    >
      <div class="flex-y-center gap-4">
        <slot name="tableHeaderLeft">
          <n-button ghost>
            <Iconify class="i-ph:plus-circle-bold" />
          </n-button>
          <n-button ghost>
            <Iconify class="i-ph:trash-simple-bold" />
          </n-button>

          <n-input-group class="w-100">
            <n-input
              clearable
              v-model:value="selectValue"
            />
            <n-button
              strong
              secondary
              @click="emits('selectChanga', selectValue)"
            >
              <Iconify class="i-ph:list-magnifying-glass-bold" />
            </n-button>
          </n-input-group>
        </slot>
      </div>
      <div class="flex-y-center gap-4">
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
      :scroll-x="props.scrollX ?? scrollautoX"
      :striped="tablestriped"
      :row-key="rowKey"
      :row-props="rowProps"
      @update:checked-row-keys="handleCheck"
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

import { zaiTableProps } from './props'
import { createTableContext } from './hooks/useTableContext'
import { useCssVars } from '@/hooks/useCssVars'
import { tableDensity } from './enum'
import { type ZaiTableEmitType, createTableEmitContext } from './hooks/useTableEmits'
import { useKoutSide } from './hooks/useKoutSide'

import type { DataTableRowKey } from 'naive-ui'

const props = defineProps(zaiTableProps)
const emits = defineEmits<ZaiTableEmitType>()

createTableEmitContext(emits)

const headerStyle = useCssVars(['primaryColor', 'borderColor'])
const tablestriped = ref(props.striped ?? false)
const tablebordered = ref(props.bordered ?? true)
const selectValue = defineModel('select', {
  type: String,
})

const tableSize: Ref<'small' | 'medium' | 'large'> = ref(props.size ?? 'medium')
const densitySelect = (key: 'small' | 'medium' | 'large') => {
  tableSize.value = key
}

const { columns, scrollautoX, paginationReactive } = createTableContext(props)

const { dropdownXY, showDropdownRef, rowProps, dropdownOptions, onClickoutside, handleSelect } = useKoutSide(emits)

const handleCheck = (rowKeys: DataTableRowKey[]) => {
  emits('checkedRows', rowKeys)
}
</script>

<style scoped>
:deep(.n-button .n-button__border) {
  border: none;
}
</style>
