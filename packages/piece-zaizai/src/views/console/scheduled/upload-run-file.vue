<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { useCssVars } from '@/hooks/useCssVars'
import { useUserStore } from '@/store/user'
import { useDebounceFn } from '@vueuse/core'

interface UploadFileInfo1 extends UploadFileInfo {
  duplicateFiles: boolean
}

const cssVars = useCssVars([
  'boxShadow2',
  'hoverColor',
  'primaryColor',
  'buttonColor2Hover',
  'errorColor',
  'warningColor',
])
const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = import.meta.env
const uploadHttp = VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX + 'upload-runfile'
const userstore = useUserStore()
const uploadheaders = {
  Authorization: userstore.info.secretkey ?? '',
}

const props = defineProps<{
  runFileOptions: Array<{ label: string; value: string }>
}>()

const show = defineModel('show', {
  default: false,
  type: Boolean,
})

const uploadpRovoverRef = useTemplateRef('uploadpRovoverRef')
const fileList = ref<UploadFileInfo[]>([])

watchEffect(() => {
  if (show.value) {
    document.addEventListener('paste', pasteUpload)
  } else {
    document.removeEventListener('paste', pasteUpload)
  }
})

function pasteUpload(e) {
  fileList.value = []
  const { runFileOptions } = props
  let batchId = Date.now().toString().slice(6) + Math.random().toString(36).substring(2, 15)
  let items = e.clipboardData.items
  for (const element of items) {
    if (element.kind === 'file') {
      const file = element.getAsFile()
      if (file) {
        // 要手动构建 这个数据 然后传给 n-upload 然后在submit才能触发上传
        //  id status name 主要这几个属性
        // 具体看 源码 502行 handleFileAddition 方法  然后 handleFileInputChange方式 是绑定在input的chagne回调 也可以从这里看
        const id = Date.now().toString().slice(6) + Math.random().toString(36).substring(2, 15)
        const thumbnailUrl = runFileOptions.some(sv => sv.label === file.name)
        const fileInfo: UploadFileInfo = {
          id,
          batchId,
          status: 'pending',
          name: file.name,
          thumbnailUrl: thumbnailUrl + '',
          file,
        }
        fileList.value.push(fileInfo)
      }
    }
  }

  nextTick(() => {
    fileList.value.forEach(item => {
      if (item.thumbnailUrl === 'false') {
        uploadpRovoverRef.value.submit(item.id)
      }
    })
  })
}

function beforeUpload({ file }) {
  if (props.runFileOptions.some(sv => sv.label === file.name)) {
    const index = fileList.value.findIndex(fv => fv.name === file.name)
    fileList.value[index].thumbnailUrl = 'true'
    return false
  }
}

function handlePositiveClick(id: string) {
  uploadpRovoverRef.value.submit(id)
}
function clearList() {
  fileList.value = []
}

const uploadremoved = useDebounceFn((id: string) => {
  uploadpRovoverRef.value.submit(id)
}, 400)

function uploadfinish({ file }) {
  const index = fileList.value.findIndex(fv => fv.name === file.name)
  nextTick(() => {
    fileList.value[index].thumbnailUrl = 'false'
  })
}

function uploadError({ file }) {
  const index = fileList.value.findIndex(fv => fv.name === file.name)
  nextTick(() => {
    fileList.value[index].thumbnailUrl = 'false'
  })
}
</script>

<template>
  <n-drawer
    v-model:show="show"
    width="40vw"
  >
    <n-drawer-content>
      <n-upload
        ref="uploadpRovoverRef"
        multiple
        accept=".js,.ts"
        directory-dnd
        :action="uploadHttp"
        :headers="uploadheaders"
        :show-file-list="false"
        v-model:file-list="fileList"
        @before-upload="beforeUpload"
        @finish="uploadfinish"
        @error="uploadError"
      >
        <n-upload-dragger>
          <div class="h-50 line-height-[14]">
            <h4>点击、拖动、粘贴文件到该区域来上传</h4>
          </div>
        </n-upload-dragger>
      </n-upload>
      <div class="mt-5">
        <div class="mt-10px mb-30px w-full">
          <n-button
            block
            @click="clearList"
          >
            <Iconify class="i-line-md-close-circle mr-2" /> 清空列表
          </n-button>
        </div>
        <div
          :style="[cssVars]"
          class="w-full p-4px bg-[--n-color] shadow-[--zai-box-shadow2] rounded-8px min-h-34px"
        >
          <n-scrollbar style="max-height: 55vh">
            <div
              class="w-full min-h-34px hover:bg-[--zai-hover-color] rounded-4px flex-y-center flex-justify-between cursor-pointer p-x12px pt-4px hover:transition duration-300 m-y-1px pos-relative"
              v-for="(item, index) in fileList"
              :key="item.id"
              :class="[item.percentage > 0 && item.status !== 'finished' ? 'pb-10px' : 'pb-4px']"
            >
              <p
                class="font-600"
                :class="[
                  item.status === 'error'
                    ? 'text-[--zai-error-color]'
                    : item.thumbnailUrl === 'true'
                    ? 'text-[--zai-warning-color]'
                    : 'text-[--zai-primary-color]',
                ]"
              >
                {{ item.name }}
              </p>
              <p
                v-if="item.thumbnailUrl === 'true'"
                class="bg-[--zai-button-color2hover] p-x-12px rounded-8px text-[--zai-warning-color]"
              >
                提示：文件已存在，请手动确认上传 {{ item.thumbnailUrl }}
              </p>
              <div class="flex-y-center gap-1">
                <n-button
                  quaternary
                  type="success"
                  size="small"
                  v-if="item.status === 'finished'"
                >
                  <Iconify class="i-line-md-confirm" />
                </n-button>

                <n-button
                  quaternary
                  type="error"
                  size="small"
                  v-if="item.status === 'error' || item.status === 'removed'"
                  @click="fileList.splice(index, 1)"
                >
                  <Iconify class="i-line-md-close-small" />
                </n-button>

                <n-button
                  quaternary
                  type="tertiary"
                  size="small"
                  v-if="item.status === 'error' || item.status === 'removed'"
                  @click="uploadremoved(item.id)"
                >
                  <Iconify class="i-line-md-rotate-270" />
                </n-button>

                <n-popconfirm
                  v-if="item.thumbnailUrl === 'true'"
                  @positive-click="handlePositiveClick(item.id)"
                >
                  <template #trigger>
                    <n-button
                      quaternary
                      type="tertiary"
                      size="small"
                    >
                      <Iconify class="i-line-md-upload" />
                    </n-button>
                  </template>
                  文件已存在，确认上传覆盖
                </n-popconfirm>
              </div>
              <div
                class="absolute w-98% left-6px"
                v-if="item.percentage > 0 && item.status !== 'finished'"
                :class="[item.percentage > 0 ? 'bottom-4px' : 'bottom-3px']"
              >
                <n-progress
                  type="line"
                  status="error"
                  :percentage="item.percentage"
                  :show-indicator="false"
                />
              </div>
            </div>
          </n-scrollbar>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
:deep(.n-progress .n-progress-graph .n-progress-graph-line .n-progress-graph-line-rail) {
  height: 2px;
}
</style>
