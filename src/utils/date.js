export function formatDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 周一为一周起始 */
export function getWeekDateKeys(reference = new Date()) {
  const ref = new Date(reference)
  ref.setHours(0, 0, 0, 0)
  const day = ref.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(ref)
  monday.setDate(ref.getDate() + mondayOffset)

  const keys = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    keys.push(formatDateKey(d))
  }
  return keys
}

export function formatDisplayDate(key) {
  const date = parseDateKey(key)
  const today = formatDateKey()
  const yesterday = formatDateKey(new Date(Date.now() - 86400000))
  if (key === today) return '今天'
  if (key === yesterday) return '昨天'
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
}

export function formatWeekRange(reference = new Date()) {
  const keys = getWeekDateKeys(reference)
  const start = parseDateKey(keys[0])
  const end = parseDateKey(keys[6])
  return `${start.getMonth() + 1}/${start.getDate()} – ${end.getMonth() + 1}/${end.getDate()}`
}
