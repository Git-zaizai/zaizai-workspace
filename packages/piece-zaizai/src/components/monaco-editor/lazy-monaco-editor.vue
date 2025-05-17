<script setup lang="ts">
import { type BundledTheme } from 'vitepress-md-renderer-web'

const props = defineProps<{
  lazy: boolean
  theme?: BundledTheme
  leng?: string
  value?: string
  fileName?: string
  mask?: boolean
}>()

const emits = defineEmits<{
  save: [string]
}>()

const DynamicComponent = shallowRef(null)

const show = defineModel('show', {
  type: Boolean,
  default: false,
})

watchEffect(() => {
  if (props.lazy) {
    DynamicComponent.value = defineAsyncComponent(() => import('./monaco-editor.vue'))
  }
})

const bandUpdateShow = value => {
  show.value = value
}
</script>

<template>
  <component
    v-if="lazy"
    :show="show"
    :theme="theme"
    :leng="leng"
    :mask="mask"
    :value="value"
    :fileName="fileName"
    @update:show="bandUpdateShow"
    :is="DynamicComponent"
    @save="(value) => emits('save', value)"
  />
</template>

<style lang="scss" scoped></style>
