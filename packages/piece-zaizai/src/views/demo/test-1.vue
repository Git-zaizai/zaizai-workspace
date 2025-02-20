<template>
  <div>
    <n-flex>
      <n-button @click="showModal1 = !showModal1"> card 预设 </n-button>
      <n-button @click="showModal2 = !showModal2"> dialog 预设 </n-button>
      <n-button @click="showModal3 = !showModal3"> 无预设 </n-button>
      <n-button @click="showModal4 = !showModal4"> 弹窗嵌套 </n-button>
    </n-flex>
    <n-modal
      v-model:show="showModal1"
      title="card 预设拖拽"
      preset="card"
      draggable
      :style="{ width: '800px' }"
    >
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
    </n-modal>
    <n-modal
      v-model:show="showModal2"
      title="dialog 预设拖拽"
      preset="dialog"
      draggable
      :style="{ width: '800px' }"
    >
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
      <div>无意义的内容...</div>
    </n-modal>

    <n-modal
      v-model:show="showModal3"
      title="无预设拖拽"
      draggable
      :style="{ width: '800px' }"
    >
      <template #default="{ draggableClass }">
        <n-card>
          <div :class="draggableClass">点我拖拽</div>
        </n-card>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { useModal } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  data() {
    return {
      showModal1: ref(false),
      showModal2: ref(false),
      showModal3: ref(false),
      showModal4: ref(false),
    }
  },
})
</script>
