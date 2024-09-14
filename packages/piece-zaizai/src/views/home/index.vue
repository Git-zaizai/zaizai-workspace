<template>
  <div>
    <left-image class="left-image" />
    <right-image class="right-image" />
    <div class="flex-col-center h-87vh">
      <h1>( *￣▽￣)</h1>
    </div>
  </div>
</template>
<script name="home" lang="ts" setup>
import LeftImage from './Left.vue'
import RightImage from './Right.vue'
</script>
<style lang="scss" scoped>
.left-image {
  position: fixed;
  left: 0;
  // right: calc(50% + 270px);
  // width: calc(50% - 270px);
  min-width: 37vw;
  top: 50%;
  transform: translateY(-50%);
}

.right-image {
  position: fixed;
  right: 0;
  // width: 440px;
  min-width: 37vw;
  top: 50%;
  transform: translateY(-50%);
}
</style>
