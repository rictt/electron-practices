<script setup lang="ts">
import { ffmpegIpcRendererService } from '@renderer/ipc/ffmpeg'
import { fileIpcRendererService } from '@renderer/ipc/file'
import { reactive } from 'vue'

const state = reactive({
  storageDir: '',
  inputFilePath: '',
  fileProgress: {
    status: ''
  }
})

const openFile = async () => {
  const result = await fileIpcRendererService.selectFile({
    title: '设置存储目录',
    properties: ['openDirectory']
  })
  state.storageDir = result
}

const selectHandleFile = async () => {
  const path = await fileIpcRendererService.selectFile({
    title: '选择文件',
    properties: ['openFile']
  })
  state.inputFilePath = path
}

const openOutputFolder = () => {
  fileIpcRendererService.selectFile({
    defaultPath: 'C:\\Users\\liaozhicheng\\Desktop\\代办项\\test3.mp4'
  })
}

const toMp4 = async () => {
  const outputFilePath = 'C:\\Users\\liaozhicheng\\Desktop\\代办项\\test3.mp4'
  await ffmpegIpcRendererService.flvToMp4({
    storageDir: 'C:\\Users\\liaozhicheng\\Desktop\\代办项',
    inputFilePath: 'F:\\录播\\23618914-语者_kate\\1.flv',
    outputFilePath,
    onProgress: (progress) => {
      console.log('progress: ', progress)
      progress.percent = Math.floor(progress.percent)
      state.fileProgress = progress
    },
    onFinished: () => {
      console.log('finished: ')
    }
  })
}

</script>

<template>
  <div>
    <el-form>
      <el-form-item label="存储目录为：">
        <el-button @click="openFile" v-if="!state.storageDir">设置目录</el-button>
        {{ state.storageDir }}
      </el-form-item>
      <el-form-item label="选择处理文件：">
        <el-button @click="selectHandleFile" v-if="!state.inputFilePath">选择文件</el-button>
        {{ state.inputFilePath }}
      </el-form-item>
      <el-form-item label="转换进度：">
        <div style="width: 350px">
          <el-progress :percentage="state.fileProgress.percent" />
          <el-button type="primary" @click="openOutputFolder">打开文件</el-button>
        </div>
      </el-form-item>
      <div>
        <el-button type="primary" @click="toMp4">转成mp4</el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="less"></style>
