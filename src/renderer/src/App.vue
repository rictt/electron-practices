<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import LayoutNav from './components/LayoutNav.vue'
import { ffmpegIpcRendererService } from './ipc/ffmpeg';

onMounted(() => {
  setTimeout(async () => {
    await ffmpegIpcRendererService.screenRecord({
      x: 10,
      y: 10,
      width: 300,
      height: 300
    })
  }, 1000)
})
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