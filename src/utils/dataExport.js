import { loadStore } from '../storage'

const EXPORT_VERSION = 1

export function exportData() {
  const store = loadStore()
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: store,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `运动打卡备份-${formatDateKey()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function formatDateKey() {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        const data = parsed?.data ?? parsed
        if (!data?.days || typeof data.days !== 'object') {
          reject(new Error('备份文件格式不正确'))
          return
        }
        resolve(data)
      } catch {
        reject(new Error('无法解析 JSON 文件'))
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}
