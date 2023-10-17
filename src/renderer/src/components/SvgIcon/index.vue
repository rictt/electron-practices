<template>
  <svg :class="svgClass" :style="{ fontSize: iconSize }" aria-hidden="true">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#409eff'
  },
  size: {
    type: [Number, String],
    default: 0
  }
})
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`
})
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})

const iconSize = computed(() => {
  if (props.size) {
    return props.size + 'px'
  }
  return ''
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
