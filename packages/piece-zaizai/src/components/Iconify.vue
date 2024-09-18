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
