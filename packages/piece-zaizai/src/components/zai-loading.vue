<template>
  <div
    class="pos-relative"
    :style="cssVars"
  >
    <div
      class="zai-loading-content"
      :style="{
        opacity: show ? 0.38 : 1,
        transition: 'opacity .3s cubic-bezier(0.4, 0, 0.2, 1)',
      }"
    >
      <slot></slot>
    </div>

    <div
      v-if="show"
      class="zai-body"
    >
      <svg
        class="truck w-20"
        viewBox="0 0 48 24"
        width="48px"
        height="24px"
        :style="{
          width: size + 'rem',
        }"
      >
        <g
          fill="none"
          stroke="currentcolor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          transform="translate(0,2)"
        >
          <g class="tt-bb">
            <g stroke-dasharray="105 105">
              <polyline
                class="tt-oo1"
                points="2 17,1 17,1 11,5 9,7 1,39 1,39 6"
              />
              <polyline
                class="tt-oo2"
                points="39 12,39 17,31.5 17"
              />
              <polyline
                class="tt-oo3"
                points="22.5 17,11 17"
              />
              <polyline
                class="tt-ww1"
                points="6.5 4,8 4,8 9,5 9"
              />
              <polygon
                class="tt-ww2"
                points="10 4,10 9,14 9,14 4"
              />
            </g>
            <polyline
              class="tt-ll"
              points="43 8,31 8"
              stroke-dasharray="10 2 10 2 10 2 10 2 10 2 10 26"
            />
            <polyline
              class="tt-ll"
              points="47 10,31 10"
              stroke-dasharray="14 2 14 2 14 2 14 2 14 18"
            />
          </g>
          <g stroke-dasharray="15.71 15.71">
            <g class="tt-ee">
              <circle
                class="tt-ee-spin"
                r="2.5"
                cx="6.5"
                cy="17"
              />
            </g>
            <g class="tt-ee">
              <circle
                class="tt-ee-spin"
                r="2.5"
                cx="27"
                cy="17"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div
      v-if="show && pointerEvents"
      class="zai-body-qita"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useCssVars } from '@/hooks/useCssVars'

const props = withDefaults(
  defineProps<{
    pointerEvents?: boolean
    size?: string | number
    zIndex?: string | number
  }>(),
  {
    pointerEvents: true,
    zIndex: 999999,
  }
)

const cssVars = useCssVars(
  [],
  null,
  {
    'loading-color': 'primaryColor',
  },
  {
    '--zai-z-index': props.zIndex,
  }
)
const show = defineModel('show', {
  type: Boolean,
  default: true,
})
</script>

<style scoped>
.zai-body {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: var(--zai-z-index);
}
.zai-body-qita {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  z-index: var(--zai-z-index);
}
</style>
