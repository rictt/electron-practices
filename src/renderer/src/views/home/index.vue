<script setup lang="ts">
import { reactive } from 'vue'
import SvgPreview from '../../components/SvgIcon/preview.vue'
import Cook from '@/components/Cook/index.vue'
import Hls from '@/components/Hls/index.vue'

</script>

<template>
  <div>
    <SvgPreview />
    <div>
      <!-- <Cook /> -->
      <Hls />
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>