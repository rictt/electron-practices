<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const onBack = () => {
  router.push({
    name: "home"
  })
}
</script>

<template>
  <el-empty description="似乎来到了荒漠~" />
  <div style="text-align: center">
    <el-button type="primary" @click="onBack">返回首页</el-button>
  </div>
</template>

<style lang="less" scoped></style>
