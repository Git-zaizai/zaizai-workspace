<template>
  <n-button
    quaternary
    size="small"
    @click="active = !active"
  >
    <Iconify class="i-ph:codesandbox-logo-fill" />
  </n-button>
  <n-drawer
    v-model:show="active"
    :width="width"
  >
    <n-drawer-content
      title="App setting"
      :native-scrollbar="false"
    >
      <div class="flex-col justify-between">
        <div>
          <n-divider> 主题模式 </n-divider>
          <n-space
            vertical
            justify="space-between"
          >
            <n-space justify="space-between">
              <span>深色主题</span>
              <n-switch
                :value="app.theme === 'dark'"
                @update-value="val => app.$patch({ theme: val ? 'dark' : 'light' })"
              ></n-switch>
            </n-space>

            <n-space justify="space-between">
              <span>自动主题：（以时间来设置）</span>
              <n-switch
                :value="app.autoTheme"
                @update-value="app.$patch({ autoTheme: !app.autoTheme })"
              />
            </n-space>
          </n-space>
          <n-divider> 过渡动画 </n-divider>

          <n-space justify="space-between">
            <span>页面切换动画类型</span>
            <n-select
              class="min-w-[100px]"
              size="small"
              :value="app.transition.value"
              :options="app.transitionList"
              @update:value="app.setTransition"
            />
          </n-space>
          <n-divider> 主题 </n-divider>

          <n-grid
            :cols="8"
            :x-gap="8"
            :y-gap="12"
            class=""
          >
            <n-grid-item
              v-for="color in themeColorList"
              :key="color"
              class="flex-x-center"
            >
              <ColorCheckbox
                :color="color"
                :theme-color="app.themeColor"
                @click="appPatch(color)"
              />
            </n-grid-item>
          </n-grid>

          <n-color-picker
            class="mt-15px"
            :modes="['hex']"
            :value="app.themeColor"
            :show-alpha="false"
            @update-value="appPatch"
          />

          <n-button
            class="mt-10px"
            block
            type="tertiary"
            @click="visible = true"
          >
            更多预设
          </n-button>

          <layoutSetting />
        </div>

        <div>
          <n-button
            class="mt-28vh"
            block
            type="tertiary"
            @click="reset"
          >
            恢复默认
          </n-button>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
  <color-modal
    v-model:visible="visible"
    @change="appPatch"
  />
</template>

<script setup lang="ts">
import { appStore } from '@/store'
import { themeColorList } from './colorData'
import ColorCheckbox from './color-checkbox.vue'
import colorModal from './color-modal.vue'
import layoutSetting from './layout-setting.vue'

interface Props {
  width?: number | string
}

withDefaults(defineProps<Props>(), {
  width: 300,
})

const app = appStore()

const appPatch = (color: string) => {
  app.$patch({ themeColor: color })
}

const visible = ref<boolean>(false)
const active = defineModel('show', {
  type: Boolean,
  default: false,
})

const reset = () => {
  try {
    app.$reset()
    window.$message.success('恢复默认成功')
  } catch (e) {
    window.$message.error('恢复默认失败')
  }
}
</script>

<style scoped></style>
