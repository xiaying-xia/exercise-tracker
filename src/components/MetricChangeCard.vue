<script setup>
import { computed } from 'vue'
import { formatBodyValue } from '../utils/body'
import { formatDelta } from '../utils/analytics'
import { formatDisplayDate } from '../utils/date'

const props = defineProps({
  label: { type: String, required: true },
  unit: { type: String, required: true },
  change: { type: Object, required: true },
  isSingleDay: { type: Boolean, default: false },
})

const subtitle = computed(() => {
  if (!props.change.hasData) return '本周期暂无记录'
  if (props.isSingleDay && props.change.noPrevious) {
    return '仅今日有记录，暂无可对比的更早数据'
  }
  if (props.change.count === 1 && !props.isSingleDay) {
    return '周期内仅 1 次记录'
  }
  const startDate = formatDisplayDate(props.change.start.key)
  const endDate = formatDisplayDate(props.change.end.key)
  if (props.change.start.key === props.change.end.key) {
    return startDate
  }
  return `${startDate} → ${endDate}`
})

const deltaClass = computed(() => {
  if (!props.change.hasData || props.change.delta === 0) return 'neutral'
  return props.change.delta > 0 ? 'up' : 'down'
})
</script>

<template>
  <article class="metric-card card">
    <header class="metric-header">
      <h3 class="metric-title">{{ label }}</h3>
      <span v-if="change.hasData" class="metric-delta" :class="deltaClass">
        {{ formatDelta(change.delta, unit) }}
      </span>
    </header>
    <p class="metric-sub">{{ subtitle }}</p>
    <div v-if="change.hasData" class="metric-values">
      <div class="metric-value-block">
        <span class="mv-label">{{ isSingleDay ? '对比日' : '期初' }}</span>
        <strong>{{ formatBodyValue(change.start.value, unit) }}</strong>
      </div>
      <span class="metric-arrow" aria-hidden="true">→</span>
      <div class="metric-value-block">
        <span class="mv-label">{{ isSingleDay ? '今日' : '期末' }}</span>
        <strong>{{ formatBodyValue(change.end.value, unit) }}</strong>
      </div>
    </div>
    <p v-else class="empty-hint small">在「身体」页记录后，这里会显示变化</p>
  </article>
</template>
