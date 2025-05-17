<!-- 
 
先放着
-->

<script setup lang="ts">
import { useCssVars } from '@/hooks/useCssVars'

defineOptions({
  name: 'ZaiSelectItem',
})

type Options = { label: string; value: string | number } | string | number

defineProps<{
  options: Options[]
}>()

const value = defineModel('value', {
  type: [String, Number, Object],
  default: 0,
})
const cssVars = useCssVars(['boxShadow2', 'hoverColor', 'primaryColor', 'baseColor', 'buttonColor2Hover'])
const handleClick = (item: Options) => {
  
}

</script>

<template>
  <div
    :style="[cssVars]"
    class="w-full p-4px bg-[--zai-base-color] shadow-[--zai-box-shadow2] rounded-8px"
  >
    <!-- bg-[--zai-button-color2hover] -->
    <div
      class="w-full min-h-34px hover:bg-[--zai-hover-color] rounded-4px flex-y-center flex-justify-between cursor-pointer p-x12px hover:transition duration-300 m-y-1px"
    >
      <p class="text-[--zai-primary-color]">啊实打实</p>
      <Iconify class="i-ph-check text-[--zai-primary-color]" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
