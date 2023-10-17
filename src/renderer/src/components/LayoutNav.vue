<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { systemIpcRendererService } from '@renderer/ipc/system'

const activeIndex = ref('0')
const router = useRouter()

const menuList = ref<any>([
  { label: '首页', name: 'home' },
  {
    label: '视频处理',
    name: 'ffmpeg',
    children: [
      { label: '测试页面', name: 'ffmpeg' },
      {
        label: '录屏',
        onClick: () => {
          systemIpcRendererService.showCapture()
        }
      },
      { label: '分析', name: 'ffmpeg:info' },
      { label: 'GIF', name: 'ffmpeg:gif' },
      { label: '开启直播' }
    ]
  },
  { label: '图片处理', name: 'resource' },
  { label: '设置', name: 'settings' }
])

const handleSelect = (key, keyPath, item) => {
  const lastIndex = keyPath[keyPath.length - 1]
  const indexs = lastIndex.split('-')
  let current
  let _menuList = menuList.value
  indexs.forEach((index) => {
    current = _menuList[index]
    _menuList = current.children || []
  })
  console.log(current)
  if (current && current.name) {
    try {
      router.push({ name: current.name })
    } catch (error) {
      router.push({ name: 'NotFound' })
    }
  } else if (current.onClick) {
    current.onClick()
  }
}
</script>

<template>
  <el-menu size="medium" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
    <template v-for="(menu, index) in menuList" :key="index">
      <el-menu-item v-if="!menu.children" :index="index + ''">{{ menu.label }}</el-menu-item>
      <el-sub-menu v-else :index="index + ''">
        <template #title>{{ menu.label }}</template>
        <el-menu-item
          v-for="(subMenu, subIndex) in menu.children"
          :key="`${index}-${subIndex}`"
          :index="`${index}-${subIndex}`"
          >{{ subMenu.label }}</el-menu-item
        >
      </el-sub-menu>
    </template>
    <!-- <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
  </el-menu>
</template>

<style lang="less" scoped></style>
