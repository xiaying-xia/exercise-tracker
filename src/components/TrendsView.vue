<script setup>
import { ref, computed, watch } from 'vue'
import { formatDateKey } from '../utils/date'
import { PERIOD_TYPES, getPeriodRange, shiftAnchor } from '../utils/period'
import { buildPeriodReport } from '../utils/analytics'
import { useAppConfig } from '../composables/useAppConfig'
import { formatDuration } from '../utils/stats'
import MetricChangeCard from './MetricChangeCard.vue'
import SimpleLineChart from './SimpleLineChart.vue'
import { hasExerciseChartData, hasBodyChartData } from '../utils/chartSeries'

const props = defineProps({
  days: { type: Object, required: true },
})

const { bodyFields } = useAppConfig()

const periodType = ref('week')
const anchorDate = ref(new Date())
const customStart = ref(formatDateKey(new Date(Date.now() - 6 * 86400000)))
const customEnd = ref(formatDateKey())

watch(periodType, (t) => {
  if (t === 'custom') {
    customEnd.value = formatDateKey()
    if (customStart.value > customEnd.value) {
      customStart.value = formatDateKey(new Date(Date.now() - 6 * 86400000))
    }
  }
})

const periodRange = computed(() =>
  getPeriodRange(
    periodType.value,
    anchorDate.value,
    customStart.value,
    customEnd.value,
  ),
)

const report = computed(() =>
  buildPeriodReport(props.days, periodRange.value, bodyFields.value),
)

const canShift = computed(() => periodType.value !== 'custom')

function shiftPeriod(delta) {
  anchorDate.value = shiftAnchor(periodType.value, anchorDate.value, delta)
}

</script>

<template>
  <div class="trends-view">
    <section class="card period-panel">
      <h2 class="section-title">时间范围</h2>
      <div class="period-segments" role="tablist">
        <button
          v-for="p in PERIOD_TYPES"
          :key="p.id"
          type="button"
          role="tab"
          class="period-seg"
          :class="{ active: periodType === p.id }"
          :aria-selected="periodType === p.id"
          @click="periodType = p.id"
        >
          {{ p.label }}
        </button>
      </div>

      <div v-if="periodType === 'custom'" class="custom-range">
        <label class="range-field">
          <span>开始</span>
          <input v-model="customStart" type="date" class="input date-input" />
        </label>
        <label class="range-field">
          <span>结束</span>
          <input v-model="customEnd" type="date" class="input date-input" />
        </label>
      </div>

      <div v-else class="period-nav-row">
        <button
          v-if="canShift"
          type="button"
          class="nav-btn small"
          aria-label="上一周期"
          @click="shiftPeriod(-1)"
        >
          ‹
        </button>
        <p class="period-label">{{ report.label }}</p>
        <button
          v-if="canShift"
          type="button"
          class="nav-btn small"
          aria-label="下一周期"
          @click="shiftPeriod(1)"
        >
          ›
        </button>
      </div>
      <p v-if="periodType === 'custom'" class="period-label center">
        {{ report.label }}
      </p>
    </section>

    <section class="card exercise-summary">
      <h2 class="section-title">运动时长</h2>
      <p class="summary-big">{{ report.exerciseFormatted }}</p>
      <p class="summary-meta">
        <template v-if="periodType === 'day'">当日已完成且有时长的运动合计</template>
        <template v-else>
          {{ report.exercise.activeDays }} 天有运动记录 / 共
          {{ report.exercise.dayCount }} 天
        </template>
      </p>
      <SimpleLineChart
        v-if="hasExerciseChartData(report.exerciseChart)"
        title="每日运动时长走势"
        unit="分钟"
        :points="report.exerciseChart"
        include-zero
      />
      <ul v-if="report.dailyExercise.length > 1" class="daily-breakdown">
        <li v-for="row in report.dailyExercise" :key="row.key">
          <span>{{ row.key.slice(5) }}</span>
          <span>{{ formatDuration(row.minutes) }}</span>
        </li>
      </ul>
    </section>

    <section class="metrics-section">
      <h2 class="section-title plain">体重 · 三围变化</h2>
      <p class="trends-hint">
        <template v-if="periodType === 'day'">与之前最近一次记录对比</template>
        <template v-else>周期内最早一次 → 最近一次记录</template>
      </p>
      <div v-for="field in bodyFields" :key="field.key" class="metric-block">
        <MetricChangeCard
          :label="field.label"
          :unit="field.unit"
          :change="report.metrics[field.key]"
          :is-single-day="periodType === 'day'"
        />
        <SimpleLineChart
          v-if="hasBodyChartData(report.bodyCharts[field.key])"
          :title="`${field.label}走势`"
          :unit="field.unit"
          :points="report.bodyCharts[field.key]"
          color="#0891b2"
        />
      </div>
    </section>
  </div>
</template>
