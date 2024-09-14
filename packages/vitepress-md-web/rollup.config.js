import { promises as fs } from 'fs'
import { builtinModules, createRequire } from 'module'
import { format, resolve } from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vuePlugin from '@vitejs/plugin-vue'
import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import { visualizer } from 'rollup-plugin-visualizer'
import terser from '@rollup/plugin-terser' // 压缩代码

const ROOT = fileURLToPath(import.meta.url)
const r = p => resolve(ROOT, '..', p)

const require = createRequire(import.meta.url)
const pkg = require(r('package.json'))
const DEV = !!process.env.DEV

let dependencies = Object.keys(pkg.dependencies)
let devDependencies = Object.keys(pkg.devDependencies)

const webBuild = {
  input: r('./src/index-web.ts'),
  output: [
    {
      file: 'index.js',
      format: 'es',
      dir: r('dist'),
      sourcemap: DEV,
      compact: !DEV, //该选项用于压缩 Rollup 产生的额外代码。
      assetFileNames: 'assets/[name]-[hash][extname]',
    },
    {
      format: 'es',
      file: 'index.min.js',
      dir: r('dist-min'),
      plugins: [terser()],
    },
  ],
  cache: true,
  external: [...devDependencies, ...builtinModules.flatMap(m => (m.includes('punycode') ? [] : [m, `node:${m}`]))],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    vuePlugin(),
    typescript({ tsconfig: r('build-tsconfig.json') }),

    esbuild({ target: 'node20' }),
    postcss({
      extract: true,
    }),
    json(),
    visualizer({
      filename: './public/visualizer.html',
      open: DEV,
    }),
  ],
}

export default defineConfig([webBuild])
