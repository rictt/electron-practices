<script setup lang="ts">
import { ref } from 'vue'
import ids from 'virtual:svg-icons-names'

const iconIds = ref(ids)
</script>

<template>
  <div style="font-size: 30px">
    <el-tooltip v-for="icon in iconIds" :key="icon" :content="icon" placement="top">
      <SvgIcon style="margin-right: 10px" :icon-name="icon" />
    </el-tooltip>
  </div>
</template>

<style lang="less" scoped></style>
