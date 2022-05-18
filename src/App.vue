<template>
  <router-view #="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup></script>

<style lang="scss">
@import '@/styles/index.scss';
</style>
