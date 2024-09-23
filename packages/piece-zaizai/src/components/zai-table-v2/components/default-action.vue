<template>
  <div class="flex-y-center gap-2">
    <n-button
      quaternary
      type="primary"
      size="small"
    >
      <template #icon>
        <Iconify class="i-ph:pencil-bold" />
      </template>

      编辑
    </n-button>
    <n-popconfirm>
      <template #trigger>
        <n-button
          quaternary
          type="error"
          size="small"
        >
          <template #icon>
            <Iconify class="i-ph:trash-bold" />
          </template>
          删除
        </n-button>
      </template>
      确定删除该记录吗？
    </n-popconfirm>
    <n-button
      quaternary
      type="error"
      size="small"
    >
      <template #icon>
        <Iconify class="i-ph:trash-bold" />
      </template>
      删除
    </n-button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
