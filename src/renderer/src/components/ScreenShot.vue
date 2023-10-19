<script setup lang="ts">
import { reactive } from 'vue'
import { dataIpcRendererService } from '@/ipc/data'
dataIpcRendererService.listener('capture.screenshotUrl', (url) => {
  state.screenshot = url
})

const state = reactive({
  screenshot: '',
  component: null
})
</script>

<template>
  <div class="flex flex-col items-center justify-center text-gray-600 py-4">
    <img :src="state.screenshot" alt="" />
  </div>
</template>

<style lang="less" scoped></style>
