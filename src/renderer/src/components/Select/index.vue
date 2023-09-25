<script lang="ts" setup>
import { reactive } from 'vue'
import { ElSelect } from 'element-plus'

type Option = {
  value: any
  label: string | number
}

defineProps({
  options: {
    type: Array,
    default: [] as (any[])
  }
})
</script>

<template>
  <el-select>
    <el-option
      v-for="op in options"
      :key="op.value"
      :value="op.value"
      :label="op.label"
    ></el-option>
  </el-select>
</template>

<style lang="less" scoped></style>
