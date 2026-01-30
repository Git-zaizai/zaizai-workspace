<template>
  <div class="flex-col w-full bg-[--zai-modal-color] rounded-7 shadow-[--zai-box-shadow1]" :style="cssVars">
    <div
      class="flex-y-center last:border-b-0 justify-between p-15 border-b border-b-solid border-[--zai-border-color]"
      :class="{ 'text-[--zai-text-color-disabled]': item.disabled }"
      v-for="(item, index) in options"
      :key="index"
      @click="handleClick(item)"
    >
      <p class="text-20">{{ item.label }}</p>
      <template v-if="typeof item.icon === 'function'">
        <component :is="item.icon" />
      </template>
      <Iconify v-else-if="typeof item.icon === 'string'" :class="item.icon" size="18" />
      <Iconify v-else class="i-line-md:chevron-small-double-right" size="18" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCssVars } from '@/hooks/useCssVars'
import type { VNode } from 'vue'

type IconType = string | (() => VNode)

defineProps<{
  options: Array<{ label: unknown | string; icon?: IconType; disabled?: boolean; routePath?: string }>
}>()

const cssVars = useCssVars(['borderColor', 'modalColor', 'boxShadow1', 'textColorDisabled'])
const router = useRouter()
const handleClick = (item: { disabled?: boolean; routePath?: string }) => {
  if (item.disabled || !item.routePath) {
    return
  }
  router.push(item.routePath)
}
</script>

<style scoped></style>
