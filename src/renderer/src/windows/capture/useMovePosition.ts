import { onMounted, onBeforeUnmount, ref, toRefs, reactive, computed } from 'vue'

type PositionSize = {
  sx: number // 起始x
  sy: number // 起始y
  mx: number // 移动x
  my: number // 移动y
  width: number
  height: number
  left: number
  top: number
  diffX: number // 起始位置和当前位置的水平差值
  diffY: number
  disX?: number // 水平距离，正数
  disY?: number // 垂直距离，正数
}

type Params = {
  ele: HTMLElement
  // 默认是body，比如要处理起点在ele身上，同时要监听全局移动，就需要设置全局的那个节点，比如body
  wrapper?: HTMLElement 
  isStop?: boolean
  isPrevent?: boolean
  log?: boolean
  onMouseDown?: (e: MouseEvent, data: PositionSize) => void
  onMouseMove?: (e: MouseEvent, data: PositionSize) => void
  onMouseUp?: (e: MouseEvent, data: PositionSize) => void
}

export function mouseEventWrap(params: Params) {
  let { ele, wrapper, isStop } = params
  wrapper = wrapper || document.querySelector('body')!
  let _click = false;

  const pos: PositionSize = {
    sx: 0,
    sy: 0,
    mx: 0,
    my: 0,
    disX: 0,
    disY: 0,
    diffX: 0,
    diffY: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0
  }

  const mouseDown = (event: MouseEvent) => {
    _click = true
    pos.sx = event.clientX
    pos.sy = event.clientY
    params.onMouseDown?.(event, pos)
    isStop && event.stopPropagation()
  }

  const mouseMove = (event: MouseEvent) => {
    if (!_click) return
    pos.mx = event.clientX
    pos.my = event.clientY
    pos.diffX = pos.mx - pos.sx
    pos.diffY = pos.my - pos.sy
    params.onMouseMove?.(event, pos)
    isStop && event.stopPropagation()
  }

  const mouseUp = (event: MouseEvent) => {
    _click = false;
    params.onMouseUp?.(event, pos)
    isStop && event.stopPropagation()
  }

  ele.addEventListener('mousedown', mouseDown)
  wrapper.addEventListener('mousemove', mouseMove)
  wrapper.addEventListener('mouseup', mouseUp)
  
  const remove = () => {
    ele.removeEventListener('mousedown', mouseDown)
    wrapper!.removeEventListener('mousemove', mouseMove)
    wrapper!.removeEventListener('mouseup', mouseUp)
  }
  
  return {
    remove
  }
}

export function useMovePosition(params: Params) {
  const { ele, log = true } = params
  const state = reactive({
    downed: false,
    sx: 0,
    sy: 0,
    mx: 0,
    my: 0,
    dx: 0,
    dy: 0,
    width: 0,
    height: 0,
    // 区别于sx，sy，left top做过矫正后
    left: 0,
    top: 0
  })
  
  const printLog = (msg: any) => {
    if (log) {
      console.log(msg)
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    state.sx = event.clientX
    state.sy = event.clientY
    state.downed = true
  }
  const onMouseMove = (event: MouseEvent) => {
    if (!state.downed) return
    printLog('move')
    state.mx = event.clientX
    state.my = event.clientY
    state.dx = Math.abs(state.mx - state.sx)
    state.dy = Math.abs(state.my - state.sy)
    state.width = state.dx
    state.height = state.dy
    state.left = Math.min(state.mx, state.sx)
    state.top = Math.min(state.my, state.sy)
  }
  const onMouseUp = () => {
    state.downed = false
    printLog('up')
  }

  onMounted(() => {
    ele.addEventListener('mousemove', onMouseMove)
    ele.addEventListener('mousedown', onMouseDown)
    ele.addEventListener('mouseup', onMouseUp)
  })
  onBeforeUnmount(() => {
    ele.removeEventListener('mousedown', onMouseDown)
    ele.removeEventListener('mousemove', onMouseMove)
    ele.removeEventListener('mouseup', onMouseUp)
  })

  return {
    state,
  }
}