<script lang="ts" setup>
import { reactive } from 'vue'
import axios from 'axios'
import { Parser } from 'm3u8-parser'
import UTable from '../UTable/index.vue'

const state = reactive({
  tableData: [],
  m3u8Link:
    'https://ssec2.chinaacc.com/ssec.chinaacc.com/1697012340660/GTmofTcCsSFiyhoWz2U3wRGrxvPh7r6zWjnxUFl0TUsMrEwHPhz.6uCOo2S99p2h5d6LeE0hYXDBpMaAI--o4w__.mp4/index.m3u8?cwareID=722823&videoID=1011&userID=null&time=1697012340660&code=ba12edfc6a290c0f413d3d3f8b85ad5f&host=inner.med66.com&sid=&th=pc'
})

const goParseM3U8 = () => {
  console.log(state.m3u8Link)
  const fullTsPath = (segments: []) => {
    const url = new URL(state.m3u8Link)
    const { host, protocol } = url
    const sample = segments[0]
    let start = ''
    if (sample.uri.indexOf('/') === 0) {
      start = protocol + '/'
    } else {
    }

    return segments.map((e, index) => {
      return {
        ...e,
        ts: index + 1 + '.ts',
        status: '未下载',
        url: start + e.uri
      }
    })
  }
  axios(state.m3u8Link).then((res) => {
    if (res.data && res.status === 200) {
      const content = res.data
      const parser = new Parser()
      parser.push(content)
      parser.end()
      const { manifest } = parser
      const { targetDuration } = manifest
      console.log(manifest)
      const segments = fullTsPath(manifest.segments)
      state.tableData = segments
    }
  })
}
</script>

<template>
  <div class="pr-2 py-2">
    <el-form size="small" label-width="100">
      <el-form-item label="m3u8地址：">
        <div class="flex w-full gap-x-2">
          <el-input class="flex-1" placeholder="请抓取m3u8链接地址" v-model="state.m3u8Link" />
          <el-button type="primary" @click="goParseM3U8">解析m3u8</el-button>
        </div>
      </el-form-item>

      <el-form-item label="密钥">{{  }}</el-form-item>

      <el-form-item label="ts文件列表：">
        <UTable :data="state.tableData">
          <el-table-column prop="ts" label="ts文件" />
          <el-table-column prop="duration" label="时长(s)" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作"> </el-table-column>
        </UTable>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped></style>
