<template>
  <div
    class="flex-col-center fade-404"
    ref="view404"
    :style="{ height }"
  >
    <n-result
      status="404"
      title="404"
      description="生活总归带点荒谬"
      size="huge"
    >
      <template #footer>
        <n-button
          quaternary
          round
          type="primary"
          @click="router.back()"
        >
          <Iconify class="i-ph:arrow-u-up-left-bold" />
        </n-button>
        <n-button
          class="ml-5"
          quaternary
          round
          type="warning"
          @click="router.push('/')"
        >
          <Iconify class="i-ph:barn" />
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
function findRealHeightParent(element): Element | null {
  // 如果没有找到真实高度的元素，递归检查其父元素
  let parent = element.parentElement
  if (parent.className.includes('n-config-provider')) {
    return null
  }
  while (parent && !(parent.offsetHeight > 0)) {
    parent = parent.parentElement
    if (parent === document.body) {
      return null
    }
  }

  // 返回找到的有真实高度的父元素或null（如果没有找到）
  return parent
}
const view404 = ref<HTMLElement>()
const height = ref('100%')
onMounted(() => {
  const element = findRealHeightParent(view404.value)
  if (!element) {
    height.value = '100vh'
  }
})
</script>
<style scoped>
.fade-404 {
  opacity: 0;
  animation: fade404 1.2s ease-in forwards;
}
@keyframes fade404 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
