# TODO

## 关于在本地引入 vitepress-md-renderer-web 的问题

在 workspace 引入 这个要记得打包后引入，先去 vitepress-md-renderer-web 下执行 pnpm build后 在piece-zaizai才能使用
因为当初就是使用打包后的文件  本意是因为在 piece-zaizai打包可能会造的打包多了，然后 vitepress-md-renderer-web 也是本意做插件