import {
  formatDateKey,
  parseDateKey,
  getWeekDateKeys,
  formatDisplayDate,
  formatWeekRange,
} from './date'

export const PERIOD_TYPES = [
  { id: 'day', label: '日' },
  { id: 'week', label: '周' },
  { id: 'month', label: '月' },
  { id: 'custom', label: '自定义' },
]

function keysBetween(startKey, endKey) {
  const keys = []
  const cur = parseDateKey(startKey)
  const end = parseDateKey(endKey)
  cur.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  while (cur <= end) {
    keys.push(formatDateKey(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return keys
}

export function getMonthDateKeys(reference = new Date()) {
  const ref = new Date(reference)
  ref.setHours(0, 0, 0, 0)
  const y = ref.getFullYear()
  const m = ref.getMonth()
  const last = new Date(y, m + 1, 0).getDate()
  const keys = []
  for (let d = 1; d <= last; d++) {
    keys.push(formatDateKey(new Date(y, m, d)))
  }
  return keys
}

/**
 * @param {'day'|'week'|'month'|'custom'} type
 * @param {Date} anchorDate
 * @param {string} [customStartKey]
 * @param {string} [customEndKey]
 */
export function getPeriodRange(
  type,
  anchorDate = new Date(),
  customStartKey,
  customEndKey,
) {
  const anchor = new Date(anchorDate)
  anchor.setHours(0, 0, 0, 0)

  if (type === 'day') {
    const key = formatDateKey(anchor)
    return {
      type,
      startKey: key,
      endKey: key,
      keys: [key],
      label: formatDisplayDate(key),
    }
  }

  if (type === 'week') {
    const keys = getWeekDateKeys(anchor)
    return {
      type,
      startKey: keys[0],
      endKey: keys[keys.length - 1],
      keys,
      label: `本周 ${formatWeekRange(anchor)}`,
    }
  }

  if (type === 'month') {
    const keys = getMonthDateKeys(anchor)
    const y = anchor.getFullYear()
    const m = anchor.getMonth() + 1
    return {
      type,
      startKey: keys[0],
      endKey: keys[keys.length - 1],
      keys,
      label: `${y}年${m}月`,
    }
  }

  let startKey = customStartKey || formatDateKey(anchor)
  let endKey = customEndKey || formatDateKey(anchor)
  if (startKey > endKey) [startKey, endKey] = [endKey, startKey]
  const keys = keysBetween(startKey, endKey)
  const start = parseDateKey(startKey)
  const end = parseDateKey(endKey)
  const label = `${start.getMonth() + 1}/${start.getDate()} – ${end.getMonth() + 1}/${end.getDate()}`
  return { type, startKey, endKey, keys, label: `自定义 ${label}` }
}

export function shiftAnchor(type, anchorDate, delta) {
  const d = new Date(anchorDate)
  d.setHours(0, 0, 0, 0)
  if (type === 'day') {
    d.setDate(d.getDate() + delta)
  } else if (type === 'week') {
    d.setDate(d.getDate() + delta * 7)
  } else if (type === 'month') {
    d.setMonth(d.getMonth() + delta)
  }
  return d
}
