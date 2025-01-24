<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
// import * as monaco from 'monaco-editor'
import { shikiToMonaco } from '@shikijs/monaco'
import ZaiLoading from '@/components/zai-loading.vue'
import { shikiHighlighter, type BundledTheme } from 'vitepress-md-renderer-web'

import { useCssVars } from '@/hooks/useCssVars'
import { useToggle } from '@vueuse/core'

import 'monaco-editor/esm/vs/editor/editor.main.js'
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'
import 'monaco-editor/esm/vs/language/json/jsonMode.js'

import { asynchronousImportOfLanguagePacks } from './monaco-editor-import'

const props = withDefaults(
  defineProps<{
    theme?: BundledTheme
    leng?: string
    value?: string
    fileName?: string
  }>(),
  {
    leng: 'json',
    theme: 'andromeeda',
    value: '',
    fileName: '',
  }
)

const emits = defineEmits<{
  save: [string]
}>()

const show = defineModel('show', {
  type: Boolean,
  default: false,
})
const [monacoIoading, monacoIoadingtoggle] = useToggle(true)
const cssVars = useCssVars(
  ['borderColor'],
  {
    'body-color': ['#23262e', '#23262e'],
    'text-color': ['#6b717d', '#6b717d'],
  },
  {
    'box-shadow': 'boxShadow1',
  },
  {
    'box-shadow': 'rgb(0 0 0 / 38%) 0px 0px 26px 1px',
  }
)
const monacoEditorRef = useTemplateRef('monacoEditorRef')
let monacoEditor

const createMonacoEditor = async () => {
  const appLoading: any = document.querySelector('#app-loading')
  if (appLoading.style.display !== 'none') {
    setTimeout(() => {
      createMonacoEditor()
    }, 700)
    return
  }

  nextTick(async () => {
    // await asynchronousImportOfLanguagePacks(props.leng)

    setTimeout(async () => {
      // 首先注册你需要的语言的 IDs
      /* langs.forEach(lang => {
        monaco.languages.register({ id: lang })
      }) */
      monaco.languages.register({ id: props.leng })

      monacoEditor = monaco.editor.create(monacoEditorRef.value, {
        language: props.leng,
        theme: props.theme, // 这里填的就是上面注册的主题
        folding: true, // 是否启用代码折叠
        links: true, // 是否点击链接
        contextmenu: true, // 启用上下文菜单
        scrollBeyondLastLine: false, // 设置编辑器是否可以滚动到最后一行之后,在真实内容显示出来完，在加一段空白显示
        fontSize: 16,
        autoIndent: 'full', // 控制编辑器在用户输入、粘贴、移动或缩进行时是否应自动调整缩进。默认为高级选项。
        formatOnType: true, // 在键入时是否自动格式化代码
        formatOnPaste: true, //在粘贴时是否自动格式化代码。
        automaticLayout: true, // 自动布局
        minimap: {
          enabled: true, // 是否启用预览图
        },
        // 滚动设置
        scrollbar: {
          verticalScrollbarSize: 5, // 竖向滚动条宽度
          horizontalScrollbarSize: 10, // 横向滚动条宽度
          arrowSize: 10, //箭头的大小（如果显示）。默认为11。注意：使用updateOptions()无法更新此选项。
          alwaysConsumeMouseWheel: false, // 始终消耗鼠标滚轮事件（始终在浏览器事件上调用preventDefault()和stopPropagation()）。默认为true。注意：使用updateOptions()无法更新此选项。
        },
        wordWrap: 'on', // 开启自动换行
      })

      // 创建完成后, monacoEditor会引入 一个jsonMode文件,然后使用 worker 引入了两个文件,然后才能进行格式化
      // 所以这里的定时器是一个不稳定的状态
      setTimeout(() => {
        monacoIoadingtoggle(false)
        monacoEditor.trigger('anyString', 'editor.action.formatDocument')
        monacoEditor.setValue(props.value)
      }, 500)
    }, 700)
  })
}

const dispose = () => {
  show.value = false
}

watch(show, value => {
  if (value) {
    monacoIoadingtoggle(true)
    createMonacoEditor()
  }
})

const onSave = () => {
  emits('save', monacoEditor.getValue())
}

onMounted(async () => {
  const highlighter = await shikiHighlighter([props.theme], [props.leng])
  // 注册 Shiki 主题，并为 Monaco 提供语法高亮
  shikiToMonaco(highlighter as any, monaco)
})

onBeforeUnmount(() => {
  if (monacoEditor) {
    monacoEditor.dispose()
  }
})
</script>

<template>
  <Teleport
    to="body"
    v-if="show"
  >
    <div
      :style="cssVars"
      class="fixed z-10 w-90vw h-85vh left-5vw top-10vh rounded-t-2 border border-solid border-[--zai-border-color] bg-[--zai-body-color]"
    >
      <div class="w-full h-50px flex flex-justify-between mt--1px">
        <div class="flex">
          <div
            class="w-50px h-35px flex-col-center hover:bg-[#fff]/20 rounded-tl-lg text-[--zai-text-color] cursor-pointer"
            @click="onSave"
          >
            <i-line-md-circle-twotone-to-confirm-circle-transition />
          </div>
          <div class="ml-20px text-#abb2a1 text-18px leading-35px">{{ props.fileName }}</div>
        </div>
        <div class="flex">
          <div
            class="w-50px h-35px flex-col-center hover:bg-[#fff]/20 text-[--zai-text-color] cursor-pointer"
            @click="dispose"
          >
            <i-line-md-minus />
          </div>
          <div
            class="w-50px h-35px flex-col-center hover:bg-[#fff]/20 rounded-tr-lg text-[--zai-text-color] cursor-pointer"
            @click="dispose"
          >
            <i-line-md-close-small />
          </div>
        </div>
      </div>

      <zai-loading v-model:show="monacoIoading">
        <div
          ref="monacoEditorRef"
          class="w-full h-75vh"
        ></div>
      </zai-loading>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped></style>
