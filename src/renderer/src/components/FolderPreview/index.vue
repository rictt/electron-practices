<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import Location from './location.vue'
import { fileIpcRendererService } from '@renderer/ipc/file'
import { ElMessage } from 'element-plus'

/**
 * 地址操作栏的逻辑
 *  栈 + 索引进行数据管理
 *    初始化，进入一个页面（此时前进后退都用不了），索引 = 0
 *    再进入一个文件夹，栈进入一个页面（索引 = 1，由于1》0，可以后退，不可以前进）
 *    再进入一个文件夹（索引=2，由于2》0，可以后退，不可以前进）
 *    操作一次后退，（索引=1，由于1》0， 1《2，可以后退，也可以前进）
 *    前进（索引=2，不可以前进，可以后退）
 *
 * 索引永远指向当前的地址！！
 */

const state = reactive({
  currentDirPath: '',
  dirs: [],
  loading: false,
  selectFileIndex: -1,
  pathStack: [],
  pathStackIndex: -1
})

const canForward = computed(() => {
  return state.pathStack.length - 1 > state.pathStackIndex
})
const canBackward = computed(() => {
  return state.pathStack.length > 0 && state.pathStackIndex > 0
})

const pathStackReplace = (p: string) => {
  // 文件夹双击，需要删除从当前位置后面的值
  state.pathStack.splice(state.pathStackIndex + 1)
  pathStackPush(p)
}

const pathStackPush = (p: string) => {
  state.pathStack.push(p)
  state.pathStackIndex++
}

const onDbClick = async (file) => {
  const { isDirectory, isFile } = file
  if (isDirectory) {
    state.loading = true
    const folderName = await fileIpcRendererService.pathJoin(file.dir, file.fileName)
    state.currentDirPath = folderName
    await refreshDirs(folderName)
    pathStackReplace(folderName)
  }
  if (isFile) {
    const fileName = await fileIpcRendererService.pathJoin(file.dir, file.fileName)
    const d = await fileIpcRendererService.open(fileName)
    console.log(d)
  }
}

const refreshDirs = async (folderName: string) => {
  try {
    state.loading = true
    const dirs = await fileIpcRendererService.getDirs(folderName)
    state.dirs = dirs
    state.loading = false
    state.selectFileIndex = -1
  } catch (error) {
    console.log(error)
    ElMessage.error('系统权限不够')
  } finally {
    state.loading = false
  }
}

const onReload = async () => {
  if (!state.currentDirPath) {
    state.currentDirPath = await fileIpcRendererService.getUserHome()
  }
  await refreshDirs(state.currentDirPath)
}

const onForward = async () => {
  const newPath = state.pathStack[++state.pathStackIndex]
  await refreshDirs(newPath)
  state.currentDirPath = newPath
}

const onBackward = async () => {
  const newPath = state.pathStack[--state.pathStackIndex]
  // const newPath = await fileIpcRendererService.pathJoin(state.currentDirPath, '..')
  await refreshDirs(newPath)
  state.currentDirPath = newPath
}

onMounted(async () => {
  console.log(fileIpcRendererService)
  state.currentDirPath = await fileIpcRendererService.getUserHome()
  pathStackPush(state.currentDirPath)
  await refreshDirs(state.currentDirPath)
})
</script>

<template>
  <div>
    <Location
      :location="state.currentDirPath"
      :can-backward="canBackward"
      :can-forward="canForward"
      @reload="onReload"
      @forward="onForward"
      @backward="onBackward"
    />
    <!-- <div>
      <div>stack length:  {{ state.pathStack }}</div>
      <div>index: {{ state.pathStackIndex }}</div>
      <div>cur path: {{  state.currentDirPath }}</div>
    </div> -->
    <div v-loading="state.loading" class="file-list-wrap">
      <div v-if="state.dirs.length" class="file-list">
        <div
          v-for="(file, index) in state.dirs"
          :key="index"
          class="file-item"
          :class="{ active: index === state.selectFileIndex }"
          @click="state.selectFileIndex = index"
          @dblclick="onDbClick(file)"
        >
          <SvgIcon
            class="file-icon"
            :icon-name="file.isDirectory ? 'icon-folder-open' : 'icon-file-text2'"
          />
          <div class="file-name">{{ file.fileName }}</div>
          <div class="file-info">{{ new Date().toLocaleString() }}</div>
        </div>
      </div>
      <div v-else class="empty-tips">
        <SvgIcon class="icon" icon-name="icon-smile" />
        <div class="icon-text">似乎进入了知识荒漠~</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.file-list-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.file-list {
  width: 100%;
  padding: 4px 4px;
  overflow: auto;
  min-height: 300px;

  .file-item {
    display: flex;
    align-items: center;
    color: #666;
    padding: 4px 10px;
    font-size: 14px;
    border-radius: 4px;
    user-select: none;

    &.active {
      background-color: skyblue;
      color: #555;
    }
    .file-icon {
      font-size: 14px;
    }
    .file-name {
      flex: 1;
      padding: 0 6px;
    }
    .file-info {
      font-size: 13px;
    }
  }
}

.empty-tips {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;

  .icon {
    font-size: 100px;
    :deep(use) {
      fill: #999;
    }
  }
  .icon-text {
    margin-top: 20px;
    font-size: 13px;
  }
}
</style>
