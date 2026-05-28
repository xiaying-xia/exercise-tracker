import { sumDayMinutes } from './stats'

export function formatChartLabel(dateKey) {
  const [, m, d] = dateKey.split('-')
  return `${Number(m)}/${Number(d)}`
}

export function buildExerciseChartSeries(days, keys) {
  return keys.map((key) => ({
    key,
    label: formatChartLabel(key),
    value: sumDayMinutes(days[key]?.items ?? []),
  }))
}

export function buildBodyChartSeries(days, keys, field) {
  return keys.map((key) => {
    const raw = days[key]?.body?.[field]
    return {
      key,
      label: formatChartLabel(key),
      value:
        raw != null && !Number.isNaN(Number(raw)) ? Number(raw) : null,
    }
  })
}

export function hasExerciseChartData(points) {
  return points.some((p) => p.value > 0)
}

export function hasBodyChartData(points) {
  return points.filter((p) => p.value != null).length >= 2
}
