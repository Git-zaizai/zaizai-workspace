<template>
  <n-modal
    :show="visible"
    preset="card"
    style="width: 640px; height: 480px"
    :z-index="10001"
    @close="emits('update:visible', false)"
    @mask-click="emits('update:visible', false)"
  >
    <n-tabs>
      <n-tab-pane
        v-for="item in traditionColors"
        :key="item.label"
        :name="item.label"
        :tab="item.label"
      >
        <n-grid
          :cols="8"
          :x-gap="16"
          :y-gap="8"
        >
          <n-grid-item
            v-for="i in item.data"
            :key="i.label"
          >
            <color-checkbox
              width="100%"
              height="36px"
              :color="i.color"
              @click="emits('change', i.color)"
              theme-color="view.themeColor"
            />
            <p class="text-center">{{ i.label }}</p>
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script name="color-modal" setup lang="ts">
import ColorCheckbox from './color-checkbox.vue'
import { traditionColors } from './colorData'

const emits = defineEmits<{
  (e: 'change', value: string): void
  (e: 'update:visible', value: boolean): void
}>()

defineProps<{
  visible: boolean
}>()
</script>

<style lang="scss" scoped></style>
