<script setup lang="ts">
import { nextTick, ref, watch, onMounted, onUnmounted } from 'vue'
import { type MenuItem } from './outline'
import VPDocOutlineItem from './VPDocOutlineItem.vue'

defineProps<{
  headers: MenuItem[]
}>()

const open = ref(false)
const main = ref<HTMLDivElement>()
const items = ref<HTMLDivElement>()

function closeOnClickOutside(e: Event) {
  if (!main.value?.contains(e.target as Node)) {
    open.value = false
  }
}

watch(open, value => {
  if (value) {
    document.addEventListener('click', closeOnClickOutside)
    return
  }
  document.removeEventListener('click', closeOnClickOutside)
})

function toggle() {
  open.value = !open.value
}

function onItemClick(e: Event) {
  if ((e.target as HTMLElement).classList.contains('outline-link')) {
    // disable animation on hash navigation when page jumps
    if (items.value) {
      items.value.style.transition = 'none'
    }
    nextTick(() => {
      open.value = false
    })
  }
}

function keyupEscape(e: KeyboardEvent) {
  if (e.key === 'keyup' && open.value) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('keyup', keyupEscape)
})
onUnmounted(() => {
  document.removeEventListener('keyup', keyupEscape)
})
</script>

<template>
  <div
    id="VPLocalNavId"
    class="VPLocalNav has-sidebar fixed"
  >
    <div class="container">
      <div
        class="VPLocalNavOutlineDropdown"
        ref="main"
      >
        <button
          @click="toggle"
          :class="{ open }"
        >
          <span class="menu-text">本页导航</span>
          <span class="vpi-chevron-right icon" />
        </button>

        <Transition name="flyout">
          <div
            v-if="open"
            ref="items"
            class="items"
            @click="onItemClick"
          >
            <div class="header">
              <a
                class="top-link"
                href="#"
                @click="toggle"
              >
                回到顶部
              </a>
            </div>
            <div class="outline">
              <VPDocOutlineItem :headers="headers" />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* VPLocalNav.vue */
.VPLocalNav {
  position: sticky;
  top: 0;
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  border-bottom: 1px solid var(--vp-c-gutter);
  padding-top: var(--vp-layout-top-height, 0px);
  width: 100%;
  background-color: var(--vp-local-nav-bg-color);
}

.VPLocalNav.fixed {
  position: fixed;
}

@media (min-width: 960px) {
  /*  .VPLocalNav {
    top: var(--vp-nav-height);
  }
 */
  .VPLocalNav.has-sidebar {
    padding-left: var(--vp-sidebar-width);
  }
  /* 
  .VPLocalNav.empty {
    display: none;
  } */
}

@media (min-width: 1280px) {
  .VPLocalNav {
    display: none;
  }
}

@media (min-width: 1440px) {
  .VPLocalNav.has-sidebar {
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}

.container {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.menu {
  display: flex;
  align-items: center;
  padding: 12px 24px 11px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 768px) {
  .menu {
    padding: 0 32px;
  }
}

@media (min-width: 960px) {
  .menu {
    display: none;
  }
}

.menu-icon {
  margin-right: 8px;
  font-size: 14px;
}

.VPOutlineDropdown {
  padding: 12px 24px 11px;
}

@media (min-width: 768px) {
  .VPOutlineDropdown {
    padding: 12px 32px 11px;
  }
}
</style>

<style scoped>
.VPLocalNavOutlineDropdown {
  padding: 12px 20px 11px;
}

@media (min-width: 960px) {
  .VPLocalNavOutlineDropdown {
    padding: 12px 36px 11px;
  }
}

.VPLocalNavOutlineDropdown button {
  display: block;
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
  position: relative;
}

.VPLocalNavOutlineDropdown button:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.VPLocalNavOutlineDropdown button.open {
  color: var(--vp-c-text-1);
}

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
  font-size: 14px;
  transform: rotate(0deg);
  transition: transform 0.25s;
}

@media (min-width: 960px) {
  .VPLocalNavOutlineDropdown button {
    font-size: 14px;
  }

  .icon {
    font-size: 16px;
  }
}

.open > .icon {
  transform: rotate(90deg);
}

.items {
  position: absolute;
  top: 40px;
  right: 16px;
  left: 16px;
  display: grid;
  gap: 1px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background-color: var(--vp-c-gutter);
  max-height: calc(100vh - 86px);
  overflow: hidden auto;
  box-shadow: var(--vp-shadow-3);
  overflow-y: overlay;
}

.items::-webkit-scrollbar {
  width: 4px;
}
.items::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.2);
  background-clip: padding-box;
}

/* @media (min-width: 960px) {
  .items {
    right: auto;
    left: calc(var(--vp-sidebar-width) + 32px);
    width: 320px;
  }
} */

.header {
  background-color: var(--vp-c-bg-soft);
  padding: 7px;
}

.top-link {
  display: block;
  width: 100%;
  height: 36px;
  line-height: 36px;
  padding-left: 15px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  border-radius: 3px;
  transition: background-color 0.25s ease-in, color 0.25s ease-in;
}

.top-link:hover {
  background-color: var(--vp-outline-bg-color);
  color: var(--vp-c-brand-2);
}

.outline {
  padding: 8px 0;
  background-color: var(--vp-c-bg-soft);
}

.flyout-enter-active {
  transition: all 0.2s ease-out;
}

.flyout-leave-active {
  transition: all 0.15s ease-in;
}

.flyout-enter-from,
.flyout-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
