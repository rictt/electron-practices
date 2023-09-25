<script lang="ts" setup>
import { reactive } from 'vue'
import { ffmpegIpcRendererService } from '@renderer/ipc/ffmpeg'

const state = reactive({

})

const clickRecord = async () => {
  const sources = await ffmpegIpcRendererService.getCapturerSources()
  console.log(sources)
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        // mand
        width: 1280,
        height: 720,
        deviceId: 'screen:1:0'
      }
    })
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => {
      video?.play()
    }
    console.log(stream)
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <div>
    <video></video>
    <el-button @click="clickRecord">录制</el-button>
  </div>
</template>

<style lang="less" scoped>

</style>