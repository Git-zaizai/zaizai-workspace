import monacoEditor from './monaco-editor.vue'
// 手动按需加载 monacoEditor 组件 这样可以进入页面时不需要加载 monacoEditor 组件
// 因为又是进来看页面，并不一定查看代码，所以可以减少加载时间
export { default as LazyMonacoEditor } from './lazy-monaco-editor.vue'

export default monacoEditor
