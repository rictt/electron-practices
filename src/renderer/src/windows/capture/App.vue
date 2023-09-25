<script lang="ts" setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue'
import { systemIpcRendererService } from '@renderer/ipc/system'
import { ffmpegIpcRendererService } from '@renderer/ipc/ffmpeg'
import { useMovePosition, mouseEventWrap } from './useMovePosition'

const state = reactive({
  mode: 'picture',
  visible: true,
  recordInstance: {}
})

const onClickStart = async () => {
  alert(`${data.width}, ${data.height}, ${data.left}, ${data.top}`)
  state.visible = false
  setTimeout(async () => {
    const recordInstance = await ffmpegIpcRendererService.screenRecord({
      x: data.left,
      y: data.top,
      width: data.width,
      height: data.height
    })
    state.recordInstance = recordInstance
    const width = document.querySelector('.recording-box')!.clientWidth
    const height = document.querySelector('.recording-box')!.clientHeight
    systemIpcRendererService.setMini(Math.ceil(width), Math.ceil(height))
  }, 16)
}

const onClickCancel = async () => {
  state.recordInstance?.close?.()
  await systemIpcRendererService.closeWindow()
}

const onFinishRecord = async () => {
  await state.recordInstance?.close()
  await systemIpcRendererService.closeWindow()
}

const { state: data } = useMovePosition({
  ele: document.querySelector('body')!,
  log: false
})

const boxStyle = computed(() => {
  return {
    visibility: data.width || data.height ? 'visible' : 'hidden',
    left: data.left + 'px',
    top: data.top + 'px',
    width: data.width + 'px',
    height: data.height + 'px'
  }
})

const menuStyle = computed(() => {
  return {
    visibility: data.width || data.height ? 'visible' : 'hidden',
    left: data.left + 'px',
    top: data.top + data.height + 20 + 'px',
  }
})

const mouseState = reactive({
  direction: '',
  sw: 0,
  sh: 0,
  oLeft: 0,
  oTop: 0
})

const createDragEvent = () => {
  const eventWrap = mouseEventWrap({
    ele: document.querySelector('#capture-box')!,
    onMouseDown: (event) => {
      console.log('mouse down')
      const direction = (event.target as HTMLElement).getAttribute('data-direction')
      if (!direction) {
        return
      }
      mouseState.direction = direction
      mouseState.sw = data.width
      mouseState.sh = data.height
      mouseState.oLeft = data.left
      mouseState.oTop = data.top
    },
    onMouseMove: (event, pos) => {
      if (!mouseState.direction) {
        return
      }
      let horizontalFlag = 1
      let verticalFlag = 1
      switch (mouseState.direction) {
        case 'leftTop':
          horizontalFlag = -1
          verticalFlag = -1
          break
        case 'rightTop':
          verticalFlag = -1
          break
        case 'leftBottom':
          horizontalFlag = -1
          break
        case 'top':
          verticalFlag = -1
          break
        case 'left':
          horizontalFlag = -1
          break
      }
      const w = pos.diffX * horizontalFlag
      const h = pos.diffY * verticalFlag
      if (!['top', 'bottom'].includes(mouseState.direction)) {
        data.width = mouseState.sw + w
      }
      if (!['left', 'right'].includes(mouseState.direction)) {
        data.height = mouseState.sh + h
      }
      if (['left', 'leftTop', 'leftBottom'].includes(mouseState.direction)) {
        data.left = mouseState.oLeft - w
      }
      if (['leftTop', 'rightTop', 'top'].includes(mouseState.direction)) {
        data.top = mouseState.oTop - h
      }
    }
  })

  return eventWrap
}

const createMoveEvent = () => {
  const event = mouseEventWrap({
    ele: document.querySelector('#pointer-box')!,
    isStop: true,
    onMouseDown(event, pos) {
      mouseState.oLeft = data.left
      mouseState.oTop = data.top
    },
    onMouseMove: (event, pos) => {
      console.log(pos.diffX, pos.diffY)
      data.left = mouseState.oLeft + pos.diffX
      data.top = mouseState.oTop + pos.diffY
    }
  })
  return event
}

onMounted(() => {
  const eventWrap = createDragEvent()
  const eventPointer = createMoveEvent()

  onUnmounted(() => {
    eventWrap.remove()
    eventPointer.remove()
  })
})
</script>

<template>
  <div v-show="state.visible">
    <div class="capture-menu" :style="menuStyle" @mousedown.stop>
      <div class="options">
        <el-radio-group class="ops-mode" v-model="state.mode">
          <el-radio-button label="picture">截图</el-radio-button>
          <el-radio-button label="gif">录制GIF</el-radio-button>
          <el-radio-button label="vido">录制视频</el-radio-button>
        </el-radio-group>
        <div class="icon-item" title="退出" @click="onClickCancel">
          <SvgIcon icon-name="icon-cross" />
        </div>
        <div class="icon-item" title="确定" @click="onClickStart">
          <SvgIcon class="icon-item" icon-name="icon-check" />
        </div>
      </div>
    </div>
  
    <div id="capture-box" class="capture-box" @mousedown.stop.prevent="" :style="boxStyle">
      <div class="point p1" data-direction="leftTop"></div>
      <div class="point p2" data-direction="rightTop"></div>
      <div class="point p3" data-direction="leftBottom"></div>
      <div class="point p4" data-direction="rightBottom"></div>
      <div class="point p5" data-direction="top"></div>
      <div class="point p6" data-direction="left"></div>
      <div class="point p7" data-direction="right"></div>
      <div class="point p8" data-direction="bottom"></div>
  
      <div id="pointer-box" class="cursor-move-box"></div>
    </div>
  </div>

  <div v-show="!state.visible" class="recording-box">
    <el-button @click="onClickCancel">取消</el-button>
    <el-button type="primary" @click="onFinishRecord">结束录制</el-button>
  </div>
</template>

<style lang="less" scoped>
.capture-box {
  position: fixed;
  top: 0;
  left: 0;
  border: 1px solid red;
  border-radius: 2px;
  color: #fff;
  visibility: hidden;
  user-select: none;

  .cursor-move-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: move;
    z-index: 10;
  }

  .point {
    display: inline-block;
    position: absolute;
    width: 2px;
    height: 2px;
    padding: 1px;
    background-color: #fff;
    border: 2px solid red;
    z-index: 11;

    &::after {
      content: '';
      position: absolute;
      left: -8px;
      right: -8px;
      top: -8px;
      bottom: -8px;
    }

    &.p1 {
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
      cursor: nwse-resize;
    }
    &.p2 {
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      cursor: sw-resize;
    }
    &.p3 {
      bottom: 0;
      left: 0;
      transform: translate(-50%, 50%);
      cursor: sw-resize;
    }
    &.p4 {
      bottom: 0;
      right: 0;
      transform: translate(50%, 50%);
      cursor: nwse-resize;
    }
    &.p5 {
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      cursor: n-resize;
    }
    &.p6 {
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      cursor: ew-resize;
    }
    &.p7 {
      right: 0;
      top: 50%;
      transform: translate(50%, -50%);
      cursor: ew-resize;
    }
    &.p8 {
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      cursor: n-resize;
    }
  }
}
.capture-menu {
  position: fixed;
  visibility: hidden;
  padding: 8px 10px;
  background-color: #444444;
  user-select: none;
  z-index: 12;

  .options {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0 10px;
    .ops-mode {
      margin-right: 10px;
    }

    .icon-item {
      cursor: pointer;

      &:hover {
        :deep(use) {
          fill: #fff;
          opacity: 0.85;
        }
      }
    }
  }
}

.menus {
  display: flex;
  align-items: center;
  justify-content: center;
}

.recording-box {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 20px;
}
</style>
