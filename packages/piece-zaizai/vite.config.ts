import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'

import Icons from 'unplugin-icons/vite'
// icon 自动引入解析器
import IconsResolver from 'unplugin-icons/resolver'
// icon 加载 loader 自定义 icon 图标
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import monacoEditorEsmPlugin from 'vite-plugin-monaco-editor-esm'

import { visualizer } from 'rollup-plugin-visualizer'

import { URL, fileURLToPath } from 'node:url'
import { getConfigEnv, updateEnvFileVar, getVersion } from './build/index'

// https://vitejs.dev/config/
export default defineConfig(configEnv => {

  const version = getVersion()
  updateEnvFileVar(configEnv.mode, [version])

  const env = getConfigEnv(configEnv.mode)

  const plugins = []
  if (env.VITE_VISUZLIZER) {
    plugins.push(
      visualizer({
        filename: './dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.ts$/,
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
      }),
      Components({
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({
            // 自动引入的Icon组件统一前缀，默认为icon，设置false为不需要前缀
            prefix: 'i',
            // 当图标集名字过长时，可使用集合别名
            // alias: {
            //   ph: 'ph',
            //   md: 'line-md',
            // },
            customCollections: ['local'],
          }),
        ],
      }),
      UnoCSS(),
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        scale: 1.5,
        // iconCustomizer(collection, icon, props) {
        //   props.width = '1.5em'
        //   props.height = '1.5em'
        // },
        customCollections: {
          local: FileSystemIconLoader('./src/assets/icons'),
        },
      }),
      monacoEditorEsmPlugin({}),
      ...plugins,
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: [`@use "@/styles/var.scss";`],
        },
      },
    },
    base: env.VITE_BASE_URL,
    server: {
      port: 4366,
      host: '0.0.0.0',
    },
    build: {
      target: ['es2022'],
      chunkSizeWarningLimit: 2000,
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      sourcemap: env.VITE_SOURCE_MAP as boolean,
      // 暂时不能使用，会导致vitepress-md-renderer-web 的样式会冲突
      // cssCodeSplit: false, //禁用 CSS 代码拆分
      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name].[hash].js',
          chunkFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: assetInfo => {
            const extType = assetInfo.name.split('.').pop()
            if (extType === 'css') {
              return 'assets/css/[name].[hash].[ext]'
            } else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extType)) {
              return 'assets/images/[name].[hash].[ext]'
            } else if (['woff', 'woff2', 'eot', 'ttf', 'otf'].includes(extType)) {
              return 'assets/fonts/[name].[hash].[ext]'
            }
            return 'assets/static/[name].[hash].[ext]'
          },
        },
      },
    },
  }
})
