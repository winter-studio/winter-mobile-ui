<template>
  <router-view />
  <van-tabbar ref="tabbarRef" route>
    <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/catalogue" icon="search">分类</van-tabbar-item>
    <van-tabbar-item to="/message" icon="friends-o">消息</van-tabbar-item>
    <van-tabbar-item to="/me" icon="setting-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tabbar } from 'vant'

const tabbarRef = ref<InstanceType<typeof Tabbar>>()
</script>

<style scoped></style>
