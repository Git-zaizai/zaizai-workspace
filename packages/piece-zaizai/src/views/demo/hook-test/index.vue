<script
  setup
  lang="ts"
>
import zi1 from './1/index.vue'
</script>

<template>
  <div class="demo-content-view flex-col-center gap-5">
    <zi1 />

    <div class="h-5px bg-amber w-full"></div>

        <n-button
          type="success"
          @click="state.sum++"
          >点击
        </n-button>
      </div>
    </div>

    <br />
    <div class="h-1 w-full bg-amber"></div>
    <Zi />
  </div>
</template>

<style scoped>

</style>