<script setup>
import { ref } from 'vue'
import { exportData, importData } from '../utils/dataExport'
import { saveStore } from '../storage'

const emit = defineEmits(['imported'])
const fileInput = ref(null)
const message = ref('')

function onExport() {
  exportData()
  message.value = '已下载备份文件'
}

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    if (
      !confirm('导入将覆盖本机现有打卡与身体数据，是否继续？')
    ) {
      return
    }
    const data = await importData(file)
    saveStore(data)
    message.value = '导入成功'
    emit('imported')
  } catch (err) {
    message.value = err.message || '导入失败'
  }
  e.target.value = ''
}

function pickFile() {
  fileInput.value?.click()
}
</script>

<template>
  <section class="data-backup card">
    <h2 class="section-title">数据备份</h2>
    <p class="backup-hint">
      部署到公网后，数据只在本机浏览器。可导出 JSON 换机或换浏览器时恢复。
    </p>
    <div class="backup-actions">
      <button type="button" class="btn-secondary" @click="onExport">
        导出备份
      </button>
      <button type="button" class="btn-secondary" @click="pickFile">
        导入备份
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="application/json,.json"
        class="sr-only"
        @change="onFileChange"
      />
    </div>
    <p v-if="message" class="backup-msg">{{ message }}</p>
  </section>
</template>
