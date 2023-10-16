<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { fileIpcRendererService } from '@/ipc/file' 

const videoRef = ref<HTMLVideoElement>()
const selectFilePath = async () => {
  const path = await fileIpcRendererService.selectFile()
  if (!path) {
    return
  }
  // console.log(path[0])
  // videoRef.value.src = path[0]
  videoRef.value.src = 'atom://' + encodeURIComponent(path[0])
}

const submitChange = () => {

}

onMounted(() => {
  console.log(videoRef.value)
})

</script>

<template>
  <div class="px-2 py-1">
    <video ref="videoRef" class="block w-full max-w-[750px] h-[300px]" controls></video>
    <div class="pt-2 flex align-center">
      <div>
        <el-checkbox>提取音频</el-checkbox>
        <el-checkbox>消除音频</el-checkbox>
        <el-checkbox>flv转mp4</el-checkbox>
      </div>
      <div>
        <el-button @click="selectFilePath">选择文件</el-button>
        <el-button @click="submitChange">提交</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>