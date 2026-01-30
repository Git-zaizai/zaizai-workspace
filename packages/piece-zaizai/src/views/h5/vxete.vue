<script setup lang="ts">
import request from '@/api/request'
import { useCssVars } from '@/hooks/useCssVars'
import { formatStorageString } from '@/utils'
import { useDebounceFn, useToggle } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

const cssVars = useCssVars(['borderColor', 'modalColor', 'boxShadow1', 'textColorDisabled', 'successColor'])
const router = useRouter()
const route = useRoute()
const page = ref(Number(route.query.page || 1))
const pageCount = ref(100)

const [showLoading, showLoadingToggle] = useToggle(false)
let timeoutId
const dayLoading = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    showLoadingToggle(true)
  }, 1500)
}
const hideLoading = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  showLoading.value && showLoadingToggle(false)
}

interface VxeteItem {
  file: string
  size: number | string
  encoding: string
  snippet: string
  author: string
  generatedAt: string
  totalChapters: number | string
  chapters: Array<{
    title: string
    line: string | number
    byteOffset: number | string
  }>
}
const vxeteList = ref<Array<any>>([])
let vxeteCache = null

/**
 * AbortController 不会立即取消请求，只是发送取消信号，实际取消需要时间，可以理解为这个是一个异步操作，
 * 所以也会有可能会导致请求无法取消
 *
 */
let currentRequestController
const debounucefn = useDebounceFn(async () => {
  dayLoading()
  try {
    const { data, abort } = await request('/vxete/page/' + page.value + '/20')
      .get()
      .json()
    currentRequestController = abort
    if (data.value.code === 200) {
      pageCount.value = Math.ceil(data.value.total / 20)
      data.value.data.forEach((item: VxeteItem) => {
        item.size = formatStorageString(Number(item.size))
        item.snippet = item.snippet.replace(/\n\r/g, '')
        item.generatedAt = new Date(item.generatedAt).toLocaleDateString()
      })
      vxeteList.value = data.value.data
    }
  } finally {
    hideLoading()
  }
}, 300)

// 所以请求函数添加防抖，如果有旧请求，先取消旧请求
const getVxetePage = async () => {
  if (currentRequestController) {
    currentRequestController()
    currentRequestController = null
  }
  debounucefn()
}

watch(page, () => {
  getVxetePage()
})

onMounted(() => {
  getVxetePage()
})

// 弹窗表单状态
const [showModal, showModalToggle] = useToggle(false)
const formRef = ref()
const formData = ref({
  fileName: '',
  author: '',
})

watchEffect(() => {
  if (showModal.value === false) {
    formRef.value?.restoreValidation()
    formData.value = {
      fileName: '',
      author: '',
    }
  }
})

// 表单处理方法
const handleSubmit = async () => {
  if (!formData.value.fileName && !formData.value.author) {
    return
  }
  dayLoading()
  try {
    const { data } = await request('/vxete/search')
      .post({
        fileName: formData.value.fileName,
        author: formData.value.author,
      })
      .json()
    if (data.value.code === 200) {
      vxeteCache = vxeteList.value
      vxeteList.value = data.value.data
    }
  } finally {
    hideLoading()
  }
}

const reset = () => {
  if (vxeteCache) {
    vxeteList.value = vxeteCache
    vxeteCache = null
  }
  getVxetePage()
}

const download = (file: string) => {
  const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = import.meta.env
  window.open(VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX + '/vxete/' + file)
}
</script>

<template>
  <div class="h5-page-height" :style="cssVars">
    <zai-loading :show="showLoading" :size="50" description-text="不知原因加载慢，请等待...">
      <div class="w-full h-[calc(100vh-51px-21rem)] overflow-auto">
        <div
          class="p-5 bg-[--zai-modal-color] rounded-4 shadow-[--zai-box-shadow1] mb-15"
          v-for="(item, index) in vxeteList"
          :key="index"
        >
          <p class="text-16 text-[--zai-success-color]">{{ item.file }}</p>
          <p class="text-14 h-150 overflow-hidden mt-5">
            {{ item.snippet }}
          </p>
          <div class="mt-10 flex justify-between text-16">
            <span>作者:{{ item.author }} </span>
            <span>章节:{{ item.totalChapters }}</span>
            <span>
              {{ item.size }}
            </span>
            <span> {{ item.generatedAt }} </span>
            <n-button size="tiny" secondary strong @click="download(item.file)"> 下载 </n-button>
          </div>
        </div>
      </div>
      <footer class="flex-col-center w-full bg-[--zai-modal-color] h-20rem">
        <n-pagination v-model:page="page" :page-count="pageCount" size="small" show-quick-jumper>
          <template #goto>
            <span></span>
          </template>
        </n-pagination>
        <div class="w-full px-5 flex-y-center gap-5">
          <n-button class="mt-10 flex-1" size="tiny" ghost @click="() => showModalToggle(true)">查询</n-button>
          <n-button class="mt-10 flex-1" size="tiny" ghost @click="reset">重置</n-button>
        </div>
      </footer>
    </zai-loading>

    <n-modal v-model:show="showModal" class="touch-optimized">
      <div class="w-95vw bg-[--n-color] p-x-15 pt-30 pb-20 rounded-7px">
        <n-form ref="formRef" :model="formData">
          <n-form-item label="文件名">
            <n-input v-model:value="formData.fileName" clearable placeholder="请输入文件名" />
          </n-form-item>

          <n-form-item label="作者">
            <n-input v-model:value="formData.author" clearable placeholder="请输入作者名" />
          </n-form-item>

          <n-button type="primary" @click="handleSubmit" size="small" block>确认</n-button>
          <n-button @click="() => showModalToggle(false)" size="small" block class="mt-10">取消</n-button>
        </n-form>
      </div>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>
footer {
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.06);
}

.h5-page-height {
  // 优化触摸滚动性能
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;

  // 防止触摸事件阻塞
  * {
    touch-action: manipulation;
  }
}

// 优化模态框触摸事件
.n-modal {
  touch-action: none;
}

// 优化表单元素触摸
.n-input,
.n-button {
  touch-action: manipulation;
}

// 触摸优化类
.touch-optimized {
  -webkit-overflow-scrolling: touch;
  touch-action: manipulation;

  * {
    touch-action: manipulation;
  }
}
</style>
