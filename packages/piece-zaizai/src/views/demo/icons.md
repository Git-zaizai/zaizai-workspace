//@unocss-ignore
# 使用 `iconify` 图标库的方式

## `unplugin-icons`插件的方式

[参考文档](https://blog.csdn.net/weixin_46872121/article/details/138212930)

`vite.config.ts`配置

```ts

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'

import Icons from 'unplugin-icons/vite'
// icon 自动引入解析器
import IconsResolver from 'unplugin-icons/resolver'
// icon 加载 loader 自定义 icon 图标
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import { URL, fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(configEnv => {

  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          IconsResolver({
            // 自动引入的Icon组件统一前缀，默认为icon，设置false为不需要前缀
            prefix: 'i',
            // 当图标集名字过长时，可使用集合别名
            // alias: {
            //   ph: 'ph',
            //   md: 'line-md',
            // },
            customCollections:['local']
          }),
        ],
      }),
      UnoCSS(),
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        iconCustomizer(collection, icon, props) {
          props.width = '1.5em'
          props.height = '1.5em'
        },
        customCollections:{
          "local": FileSystemIconLoader('./src/assets/icons')
        }
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    }
  }
})

```

## 使用 unocss 的方式

[文档](https://unocss.nodejs.cn/presets/icons#install)

`uno.config.ts`配置

```ts
import {
  defineConfig,
  presetUno,
  presetIcons,
} from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  presets: [
    presetUno({ dark: 'class' }),
    presetIcons({
      customizations: {
        customize(props) {
          props.width = '12px'
          props.height = '12px'
          return props
        },
      },
      // 配置单个库的前缀
      collections: {
        ph: () => import('@iconify-json/ph/icons.json').then(i => i.default as any),
        'line-md': () => import('@iconify-json/line-md/icons.json').then(i => i.default),
      },
    }),
    preset,
  ],
})
```

### 还有一个

直接使用 `<i class="i-ph:airplane-takeoff-bold">` 或 `<div class="i-ph:airplane-takeoff-bold"></div>` 可能不大明显，
可以自定义封装一个组件

```vue
<template>
  <i
    :class="{ 'transition-all': props.transition }"
    :style="[style, whstyle]"
  ></i>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = defineProps({
  style: {
    type: [String, Object] as PropType<string | CSSProperties>,
  },
  size: {
    type: [Number, String, undefined],
    default: 22,
  },
  transition: {
    type: Boolean,
    default: false,
  },
})

const attr = useAttrs()

const whstyle = computed<CSSProperties>(() => {
  if (typeof props.size === 'number') {
    return {
      width: props.size + 'px',
      height: props.size + 'px',
    }
  }
  if (props.size.split(/\d+/).pop() !== '') {
    return {
      width: props.size,
      height: props.size,
    }
  }
  return {
    width: props.size + 'px',
    height: props.size + 'px',
  }
})

if (!attr.class) {
  console.error('iconify icon class is required  图标类名必填')
}

if (typeof attr.class === 'string' && !attr.class.startsWith('i-')) {
  console.error('iconify icon class must start with "i-"  请以 i- 开头')
}
</script>

<style scoped></style>
```

使用： 

```vue
<template>
  <div class="demo-content-view flex-col-center">
    <h1>unplugin-icons插件的方式</h1>
    <h2>显示引入</h2>
    <PhWarningOctagonBold />
    <div class="w-full h-1px bg-amber"></div>

    <h2>配合自动导入</h2>
    <i-ph-acorn-duotone />
    <div class="w-full h-1px bg-amber"></div>

    <h5>本地</h5>
    <i-local-test3 />
    <div class="w-full h-1px bg-amber"></div>

    <h5>unocss 的 class css 图标</h5>
    <i class="i-ph-warning-octagon-bold"></i>

    <div class="w-full h-1px bg-amber"></div>

    <h5>unocss class 配合 自定义组件</h5>
    <Iconify class="i-ph-warning-octagon-bold" />
  </div>
</template>
<script lang="ts" setup>
import PhWarningOctagonBold from '~icons/ph/warning-octagon-bold'
</script>
```