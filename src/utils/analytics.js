import { parseDateKey, formatDateKey } from './date'
import { sumDayMinutes, formatDuration } from './stats'
import {
  buildExerciseChartSeries,
  buildBodyChartSeries,
} from './chartSeries'

export function sumPeriodExerciseMinutes(days, keys) {
  let total = 0
  let activeDays = 0
  for (const key of keys) {
    const mins = sumDayMinutes(days[key]?.items ?? [])
    if (mins > 0) {
      total += mins
      activeDays += 1
    }
  }
  return { total, activeDays, dayCount: keys.length }
}

function collectMetricValues(days, keys, field) {
  const points = []
  for (const key of keys) {
    const v = days[key]?.body?.[field]
    if (v != null && !Number.isNaN(Number(v))) {
      points.push({ key, value: Number(v) })
    }
  }
  return points
}

/** 周期内：最早记录 → 最晚记录 */
export function getMetricChangeInPeriod(days, keys, field) {
  const points = collectMetricValues(days, keys, field)
  if (points.length === 0) {
    return { hasData: false, points: [] }
  }
  const start = points[0]
  const end = points[points.length - 1]
  return {
    hasData: true,
    points,
    start,
    end,
    delta: Math.round((end.value - start.value) * 10) / 10,
    count: points.length,
  }
}

/** 单日：与之前最近一条有数据的记录对比 */
export function getMetricChangeVsPrevious(days, dayKey, field) {
  const current = days[dayKey]?.body?.[field]
  if (current == null) {
    return { hasData: false }
  }
  const cur = parseDateKey(dayKey)
  let prev = null
  for (let i = 1; i <= 366; i++) {
    cur.setDate(cur.getDate() - 1)
    const key = formatDateKey(cur)
    const v = days[key]?.body?.[field]
    if (v != null && !Number.isNaN(Number(v))) {
      prev = { key, value: Number(v) }
      break
    }
  }
  const end = { key: dayKey, value: Number(current) }
  if (!prev) {
    return {
      hasData: true,
      start: end,
      end,
      delta: 0,
      count: 1,
      noPrevious: true,
    }
  }
  return {
    hasData: true,
    start: prev,
    end,
    delta: Math.round((end.value - prev.value) * 10) / 10,
    count: 1,
    noPrevious: false,
  }
}

export function buildPeriodReport(days, periodRange, bodyFields = []) {
  const { keys, type, label, startKey, endKey } = periodRange
  const exercise = sumPeriodExerciseMinutes(days, keys)

  const metrics = {}
  for (const { key } of bodyFields) {
    metrics[key] =
      type === 'day'
        ? getMetricChangeVsPrevious(days, startKey, key)
        : getMetricChangeInPeriod(days, keys, key)
  }

  const dailyExercise = keys
    .map((key) => ({
      key,
      minutes: sumDayMinutes(days[key]?.items ?? []),
    }))
    .filter((d) => d.minutes > 0)

  const exerciseChart = buildExerciseChartSeries(days, keys)
  const bodyCharts = {}
  for (const { key } of bodyFields) {
    bodyCharts[key] = buildBodyChartSeries(days, keys, key)
  }

  return {
    label,
    startKey,
    endKey,
    keys,
    exercise,
    exerciseFormatted: formatDuration(exercise.total),
    metrics,
    dailyExercise,
    exerciseChart,
    bodyCharts,
  }
}

export function formatDelta(delta, unit) {
  if (delta === 0) return '持平'
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta} ${unit}`
}
