<script setup lang="ts">
import LayoutNav from './components/LayoutNav.vue'

</script>

<template>
  <div>
    <LayoutNav />
    <div style="padding: 10px 0;">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>