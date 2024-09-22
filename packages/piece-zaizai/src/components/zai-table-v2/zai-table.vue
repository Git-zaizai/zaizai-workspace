<template>
  <div>
    <div
      class="flex-y-center justify-between pb-3"
      :style="headerStyle"
    >
      <div class="flex-y-center gap-4">
        <slot name="tableHeaderLeft"> </slot>
      </div>
      <div class="flex-y-center gap-4">
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
      </div>
    </div>
    <n-data-table
      v-bind="props"
      :size="tableSize"
    />
  </div>
</template>

<script setup lang="ts">
import { zaiTableProps } from './props'
import { useCssVars } from '@/hooks/useCssVars'
import { tableDensity } from './const'

const props = defineProps(zaiTableProps)

const tableSize: Ref<'small' | 'medium' | 'large'> = ref(props.size ?? 'medium')
const densitySelect = (key: 'small' | 'medium' | 'large') => {
  tableSize.value = key
}

const headerStyle = useCssVars(['primaryColor', 'borderColor'])
</script>

<style scoped>
:deep(.n-button .n-button__border) {
  border: none;
}
</style>
