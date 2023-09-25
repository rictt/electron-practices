<script lang="ts" setup>
import { reactive } from 'vue'
import { fileIpcRendererService } from '@renderer/ipc/file'
import { ffmpegIpcRendererService } from '@renderer/ipc/ffmpeg'

const state = reactive({
  inputPath: 'F:\\test.mp4',
  mediaInfos: { streams: [] }
})

const onClickSelect = async () => {
  
  const result  = await fileIpcRendererService.selectFile()
  if (result && result.length) {
    state.inputPath = result[0]
  }
}

const onClickAnalyse = async () => {
  state.mediaInfos = await ffmpegIpcRendererService.getMetadata(state.inputPath)
}

</script>

<template>
  <div>
    <el-form>
      <el-form-item label="文件地址">
        <div>
          <span>{{ state.inputPath }}</span>
          <el-button type="primary" @click="onClickSelect">选择文件</el-button>
        </div>
      </el-form-item>
      <div>
        <h3>分析结果</h3>
        <textarea style="width: 90%; height: 500px" :rows="10" v-for="item in state.mediaInfos.streams" :value="JSON.stringify(item, null, 2)">
        </textarea>
      </div>
      <el-button type="primary" @click="onClickAnalyse">分析文件信息</el-button>
    </el-form>
  </div>
</template>

<style lang="less" scoped>

</style>