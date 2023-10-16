<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  isStatic: {
    type: Boolean,
    default: true
  },
  data: {
    type: Array,
    default: () => []
  },
  count: {
    type: Number,
    default: 0
  }
})

const state = reactive({
  currentPage: 1,
  pageSize: 10,
  tableData: props.data.slice(0, 10),
  total: props.isStatic ? props.data.length : props.count
})

watch(() => props.data, (value) => {
  state.total = props.isStatic ? props.data.length : props.count
  loadTableData()
})

const onPageChange = (size) => {
  loadTableData()
}

const loadTableData = () => {
  if (props.isStatic) {
    console.log(state.currentPage)
    const startIndex = ((state.currentPage - 1) * 10)
    console.log(props.data.slice(startIndex, startIndex + 10))
    state.tableData = props.data.slice(startIndex, startIndex + 10)
  } else {
    state.tableData = props.data
  }
}
</script>

<template>
  <el-table border :data="state.tableData" style="width: 100%">
    <slot />
  </el-table>
  <el-pagination
    v-model:current-page="state.currentPage"
    @current-change="onPageChange"
    small
    class="my-2 text-right"
    background
    layout="prev, pager, next"
    :total="state.total"
  />
</template>

<style lang="less" scoped></style>
