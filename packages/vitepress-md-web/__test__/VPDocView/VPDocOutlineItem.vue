<script setup lang="ts">
import type { MenuItem } from './outline'

defineProps<{
  headers: MenuItem[]
  root?: boolean
}>()
</script>

<template>
  <ul
    class="VPDocOutlineItem"
    :class="root ? 'root' : 'nested'"
  >
    <li v-for="{ children, link, title } in headers">
      <a
        class="outline-link"
        :href="link"
        :title="title"
        >{{ title }}</a
      >
      <template v-if="children?.length">
        <VPDocOutlineItem :headers="children" />
      </template>
    </li>
  </ul>
</template>

<style scoped>
.root {
  position: relative;
  z-index: 1;
}

.nested {
  padding-right: 16px;
  padding-left: 16px;
}

.outline-link {
  display: block;
  line-height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out;
  padding-left: 20px;
  border-radius: 3px;
}

.outline-link:hover {
  color: var(--vp-c-text-1);
}

.outline-link.active {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.outline-link.nested {
  padding-left: 13px;
}

@media (max-width: 1280px) {
  .outline-link:hover {
    background-color: var(--vp-outline-bg-color);
    color: var(--vp-c-brand-2);
  }
}
</style>
