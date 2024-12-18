<script setup lang="ts"></script>

<template>
  <n-menu
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    v-model:value="selectedKey"
  />
</template>
