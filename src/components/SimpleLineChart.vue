<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  unit: { type: String, default: '' },
  points: { type: Array, default: () => [] },
  color: { type: String, default: '#0d9488' },
  /** 为 true 时，0 也参与绘图（运动时长） */
  includeZero: { type: Boolean, default: false },
})

const WIDTH = 320
const HEIGHT = 150
const PAD = { t: 14, r: 10, b: 26, l: 38 }

const innerW = WIDTH - PAD.l - PAD.r
const innerH = HEIGHT - PAD.t - PAD.b

const plotData = computed(() => {
  const pts = props.points
  if (!pts.length) return null

  const values = pts
    .map((p) => p.value)
    .filter((v) => v != null && (props.includeZero || v > 0))

  if (values.length === 0) return null

  let min = Math.min(...values)
  let max = Math.max(...values)
  if (min === max) {
    min = min * 0.9 || 0
    max = max * 1.1 || 1
  }
  const pad = (max - min) * 0.12 || 1
  const yMin = Math.max(0, props.includeZero ? 0 : min - pad)
  const yMax = max + pad
  const yRange = yMax - yMin || 1

  const n = pts.length
  const coords = pts.map((p, i) => {
    const x = PAD.l + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW)
    if (p.value == null) return { ...p, x, y: null }
    if (!props.includeZero && p.value <= 0) return { ...p, x, y: null }
    const y = PAD.t + innerH - ((p.value - yMin) / yRange) * innerH
    return { ...p, x, y, value: p.value }
  })

  const segments = []
  let current = []
  for (const c of coords) {
    if (c.y == null) {
      if (current.length) {
        segments.push(current)
        current = []
      }
    } else {
      current.push(c)
    }
  }
  if (current.length) segments.push(current)

  const yTicks = [yMin, yMax].map((v) => ({
    value: Math.round(v * 10) / 10,
    y: PAD.t + innerH - ((v - yMin) / yRange) * innerH,
  }))

  const xLabels = coords.filter((_, i) => shouldShowLabel(i, n))

  return { coords, segments, yTicks, yMin, yMax, xLabels, n }
})

function shouldShowLabel(i, total) {
  if (total <= 7) return true
  if (total <= 16) return i === 0 || i === total - 1 || i % 2 === 0
  return i === 0 || i === total - 1 || i % Math.ceil(total / 5) === 0
}

function segmentPath(seg) {
  if (seg.length === 1) return null
  return seg.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}
</script>

<template>
  <div class="line-chart">
    <p v-if="title" class="chart-title">{{ title }}</p>
    <div v-if="!plotData" class="chart-empty">数据不足，无法绘制折线</div>
    <svg
      v-else
      class="chart-svg"
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      role="img"
      :aria-label="title || '折线图'"
    >
      <line
        v-for="(tick, i) in plotData.yTicks"
        :key="'grid-' + i"
        :x1="PAD.l"
        :y1="tick.y"
        :x2="WIDTH - PAD.r"
        :y2="tick.y"
        class="grid-line"
      />
      <text
        v-for="(tick, i) in plotData.yTicks"
        :key="'ylabel-' + i"
        :x="PAD.l - 6"
        :y="tick.y + 4"
        class="axis-label y-label"
        text-anchor="end"
      >
        {{ tick.value }}
      </text>

      <path
        v-for="(seg, i) in plotData.segments"
        :key="'line-' + i"
        :d="segmentPath(seg)"
        fill="none"
        :stroke="color"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <template v-for="(seg, si) in plotData.segments" :key="'dots-' + si">
        <circle
          v-for="p in seg"
          :key="p.key"
          :cx="p.x"
          :cy="p.y"
          r="3.5"
          :fill="color"
        />
      </template>

      <text
        v-for="p in plotData.xLabels"
        :key="'x-' + p.key"
        :x="p.x"
        :y="HEIGHT - 6"
        class="axis-label x-label"
        text-anchor="middle"
      >
        {{ p.label }}
      </text>
    </svg>
    <p v-if="plotData && unit" class="chart-unit">单位：{{ unit }}</p>
  </div>
</template>
