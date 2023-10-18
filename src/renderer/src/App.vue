<script setup lang="ts">
import { VueElement } from 'vue'
import { ffmpegIpcRendererService } from '@/ipc/ffmpeg'
import { systemIpcRendererService } from '@/ipc/system'
import LayoutNav from './components/LayoutNav.vue'

type moduleItem = {
  name: string
  desc?: string
  component?: VueElement | undefined
  route?: string
  icon: string
  handler?: () => void
}
const modules: moduleItem[] = [
  {
    name: '录屏',
    desc: '仅支持Windows',
    component: undefined,
    route: '',
    icon: 'icon-smile',
    handler: async () => {
      await systemIpcRendererService.showCapture()
    }
  },
  {
    name: '截图',
    component: undefined,
    route: '',
    icon: 'icon-smile'
  },
  {
    name: 'FFmpeg',
    desc: 'mp4、flv、ts文件处理',
    icon: 'icon-smile'
  },
  {
    name: '打印',
    desc: '',
    icon: 'icon-smile'
  },
  {
    name: '资源管理器',
    desc: '',
    icon: 'icon-smile'
  }
]

const onClickItem = async (item) => {
  console.log(item)
  const { component, route, handler } = item
  if (handler) {
    await handler()
  }
}
</script>

<template>
  <div class="py-6">
    <div
      class="flex flex-row px-20 flex-wrap items-center justify-between after:content:'' after:w-[200px]"
    >
      <div
        v-for="item in modules"
        :key="item.name"
        class="w-[200px] h-[120px] border my-2 rounded shadow-sm cursor-pointer"
        @click="onClickItem(item)"
      >
        <div class="w-full h-full inline-flex flex-col items-center justify-between pt-4 pb-2">
          <SvgIcon :size="48" :icon-name="item.icon" />
          <div class="text-sm">{{ item.name }}</div>
          <div class="text-xs text-gray-400">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <!-- <LayoutNav />
    <div style="padding: 10px 0">
      <router-view></router-view>
    </div> -->
  </div>
</template>

<style lang="less" scoped></style>
