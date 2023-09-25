<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { fileIpcRendererService } from '@renderer/ipc/file'
import { storeIpcRendererService } from '@renderer/ipc/store'
import { ElMessage } from 'element-plus';

const form = reactive({
  storageDir: '',
  rtmpURL: '',
  checkWhenLogin: false,
  updateMode: 3
})

const ops = ref([
  { label: "3天", value: 3 },
  { label: "7天", value: 7 },
  { label: "10天", value: 10 },
  { label: "15天", value: 15 },
])

const selectFolder = async () => {
  const folder = await fileIpcRendererService.selectFolder()
  if (folder) {
    form.storageDir = folder[0]
  }
}

const saveConfig = async () => {
  console.log(form)
  await storeIpcRendererService.setConfig(form)
  ElMessage.success('保存成功')
}

const fetchConfig = async () => {
  const config = await storeIpcRendererService.getConfig()
  console.log("config", config)
  for (const key in config) {
    form[key] = config[key]
  }
}

onMounted(async () => {
  fetchConfig()
})

</script>

<template>
  <div style="max-width: 600px;">
    <el-form label-width="100">
      <el-form-item label="默认存储目录">
        <div style="display: flex; align-items: center; width: 100%;">
          <el-input style="flex: 1;" v-model="form.storageDir" disabled />
          <el-button style="margin-left: 4px;" @click="selectFolder">选择文件夹</el-button>
        </div>
      </el-form-item>
      <el-form-item label="推流地址">
        <el-input v-model="form.rtmpURL" placeholder="rtmp://" />
      </el-form-item>
      <el-form-item label="开启校验">
        <el-switch v-model="form.checkWhenLogin" />
      </el-form-item>
      <el-form-item label="更新周期">
        <SelectV2 v-model="form.updateMode" :options="ops" />
      </el-form-item>
      <div style="margin: 10px 0; text-align: center;">
        <el-button type="primary" @click="saveConfig">保存设置</el-button>
        <el-button>导出设置</el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="less" scoped></style>
