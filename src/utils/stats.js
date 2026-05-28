/** 仅累计已完成且填写了时长的项目（分钟） */
export function itemMinutes(item) {
  if (!item?.done || item.minutes == null || item.minutes <= 0) return 0
  return Number(item.minutes)
}

export function sumDayMinutes(items = []) {
  return items.reduce((sum, item) => sum + itemMinutes(item), 0)
}

export function sumWeekMinutes(days, weekKeys) {
  return weekKeys.reduce((sum, key) => {
    const day = days[key]
    return sum + sumDayMinutes(day?.items ?? [])
  }, 0)
}

export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 分钟'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} 分钟`
  if (m === 0) return `${h} 小时`
  return `${h} 小时 ${m} 分钟`
}
