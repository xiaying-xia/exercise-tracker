<script setup>
import { formatDisplayDate } from '../utils/date'

defineProps({
  dateKey: { type: String, required: true },
  isToday: { type: Boolean, default: false },
})

defineEmits(['prev', 'next', 'today'])
</script>

<template>
  <nav class="date-nav" aria-label="日期切换">
    <button type="button" class="nav-btn" aria-label="前一天" @click="$emit('prev')">
      ‹
    </button>
    <div class="date-center">
      <h1 class="date-title">{{ formatDisplayDate(dateKey) }}</h1>
      <p class="date-sub">{{ dateKey }}</p>
    </div>
    <button type="button" class="nav-btn" aria-label="后一天" @click="$emit('next')">
      ›
    </button>
  </nav>
  <button
    v-if="!isToday"
    type="button"
    class="back-today"
    @click="$emit('today')"
  >
    回到今天
  </button>
</template>
