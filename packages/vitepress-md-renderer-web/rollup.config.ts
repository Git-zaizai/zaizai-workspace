import fs from 'fs'
import { builtinModules, createRequire } from 'module'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

import { defineConfig, type RollupOptions } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vuePlugin from '@vitejs/plugin-vue'
import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import { visualizer } from 'rollup-plugin-visualizer'
import terser from '@rollup/plugin-terser' // 压缩代码
// import dts from 'rollup-plugin-dts'

const ROOT = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(ROOT, '..', p)

const require = createRequire(import.meta.url)
const pkg = require(r('package.json'))
const DEV = process.env.DEV === 'true'
console.log('🚀 ~ DEV:', DEV)

let dependencies = Object.keys(pkg.dependencies)
let devDependencies = Object.keys(pkg.devDependencies)

const webBuild: RollupOptions = {
  input: r('./src/index-web.ts'),
  output: {
    format: 'es',
    dir: r('dist/esm'),
    sourcemap: DEV,
    compact: DEV, //该选项用于压缩 Rollup 产生的额外代码。
    // assetFileNames: 'assets/[name]-[hash][extname]',
    entryFileNames: 'index.js', // 入口文件的命名
    chunkFileNames: 'js/[name].[format].[hash].js', // 动态导入的文件存放到 dist/async 目录下
    plugins: [],
  },
  external: [
    ...devDependencies,
    'vue',
    // ...dependencies,
    ...builtinModules.flatMap(m => (m.includes('punycode') ? [] : [m, `node:${m}`])),
  ],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    vuePlugin(),
    esbuild({ target: 'node20' }),
    postcss({
      extract: true,
    }),
    json(),
    visualizer({
      filename: './__test__code/webBuild.html',
      // open: DEV,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
}

// 打包web端umd格式
const webMinBuild: RollupOptions = {
  input: r('./src/index-umd.ts'),
  output: {
    name: 'viteMdRender',
    format: 'umd',
    dir: r('./dist/umd'),
    sourcemap: DEV,
    // 动态导入的文件将被命名为 chunk.[hash].js
    chunkFileNames: '[name].[format].[hash].min.js',
    inlineDynamicImports: true,
  },
  external: [
    ...devDependencies,
    // ...dependencies,
    ...builtinModules.flatMap(m => (m.includes('punycode') ? [] : [m, `node:${m}`])),
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    vuePlugin(),
    esbuild({ target: 'node20' }),
    postcss({
      extract: true,
    }),
    json(),
    terser(),
    visualizer({
      filename: './__test__code/webMinBuild.html',
      // open: DEV,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
}

// 单独打包组件
const vueComponentsBuild: RollupOptions = {
  input: r('./src/VPDocView/VPDocView.vue'),
  output: {
    format: 'esm',
    file: r('./dist/components/index.js'),
  },
  external: [
    ...devDependencies,
    ...dependencies,
    ...builtinModules.flatMap(m => (m.includes('punycode') ? [] : [m, `node:${m}`])),
  ],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    vuePlugin(),
    esbuild({ target: 'node20' }),
    postcss({
      extract: true,
    }),
    json(),
    visualizer({
      filename: './__test__code/vueComponentsBuild.html',
      // open: DEV,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
}

export default defineConfig([webBuild])
