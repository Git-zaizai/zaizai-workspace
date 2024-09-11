<template>
  <div>
    {{ sum }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sum = ref(0)
</script>

<style scoped></style>
