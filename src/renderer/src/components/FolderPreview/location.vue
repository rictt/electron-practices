<script setup lang="ts">
import {} from 'vue'

const emits = defineEmits(['backward', 'forward'])
const props = defineProps({
  canBackward: Boolean,
  canForward: Boolean,
  location: String
})

const onClickIcon = (state, fun) => {
  if (state) {
    fun()
  }
}
</script>

<template>
  <div class="location-bar">
    <div class="location-icons">
      <!-- <SvgIcon iconName="icon-arrow-left2" @click="emits('backward')"></SvgIcon>
      <SvgIcon iconName="icon-arrow-right2" @click="emits('forward')"></SvgIcon> -->
      <SvgIcon
        iconName="icon-arrow-left2"
        :class="{ 'disabled-icon': !canBackward }"
        @click="() => onClickIcon(canBackward, () => emits('backward'))"
      ></SvgIcon>
      <SvgIcon
        iconName="icon-arrow-right2"
        :class="{ 'disabled-icon': !canForward }"
        @click="() => onClickIcon(canForward, () => emits('forward'))"
      ></SvgIcon>
      <SvgIcon class="loop-icon" iconName="icon-loop2"></SvgIcon>
    </div>
    <div class="location-path">
      <input type="text" :value="location" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.location-bar {
  padding: 4px 10px;
  display: flex;
  align-items: center;

  .location-icons {
    display: flex;
    align-items: center;
    padding-right: 20px;

    :deep(.svg-icon) {
      font-size: 16px;
      padding: 5px;
      margin-right: 6px;
      transition: background-color 0.3s;
      border-radius: 50%;

      &.disabled-icon {
        background-color: transparent !important;
        use {
          fill: #ddd;
        }
      }
      &:hover {
        background-color: #f2f2f2;
        border-radius: 50%;
      }
      &:last-child {
        margin-right: 0;
      }
      use {
        fill: #999;
      }
    }
    .loop-icon {
      font-size: 16px;
    }
  }

  .location-path {
    flex: 1;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 20px;
    background-color: #e4e6eb;
    color: #111;
    input {
      display: block;
      width: 100%;
      outline: none;
      border: none;
      background: transparent;
    }
  }
}
</style>
