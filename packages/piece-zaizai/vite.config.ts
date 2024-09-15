import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { URL, fileURLToPath } from 'node:url'

import { getConfigEnv } from './build/index'

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const env = getConfigEnv(configEnv.mode)

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
        resolvers: [NaiveUiResolver()],
      }),
      UnoCSS(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/var.scss";`,
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
      cssCodeSplit: false, //禁用 CSS 代码拆分
      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name].[hash].js',
          chunkFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
  }
})
