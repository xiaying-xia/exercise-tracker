<script setup>
import { formatDuration } from '../utils/stats'

defineProps({
  dayMinutes: { type: Number, required: true },
  weekMinutes: { type: Number, required: true },
  completed: { type: Number, required: true },
  total: { type: Number, required: true },
})
</script>

<template>
  <section class="stats-bar" aria-label="运动统计">
    <div class="stat">
      <span class="stat-label">今日时长</span>
      <strong class="stat-value">{{ formatDuration(dayMinutes) }}</strong>
    </div>
    <div class="stat-divider" aria-hidden="true" />
    <div class="stat">
      <span class="stat-label">本周累计</span>
      <strong class="stat-value">{{ formatDuration(weekMinutes) }}</strong>
    </div>
    <div class="stat-divider" aria-hidden="true" />
    <div class="stat">
      <span class="stat-label">今日完成</span>
      <strong class="stat-value">{{ completed }}/{{ total }}</strong>
    </div>
  </section>
</template>
