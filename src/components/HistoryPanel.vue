<script setup>
import { formatDisplayDate } from '../utils/date'
import { sumDayMinutes, formatDuration } from '../utils/stats'

const props = defineProps({
  keys: { type: Array, required: true },
  days: { type: Object, required: true },
  activeKey: { type: String, required: true },
})

defineEmits(['select'])
</script>

<template>
  <section class="history-panel">
    <h2 class="section-title">最近记录</h2>
    <ul v-if="keys.length" class="history-list">
      <li v-for="key in keys" :key="key">
        <button
          type="button"
          class="history-item"
          :class="{ active: key === activeKey }"
          @click="$emit('select', key)"
        >
          <span>{{ formatDisplayDate(key) }}</span>
          <span class="history-meta">
            {{ days[key]?.items?.filter((i) => i.done).length ?? 0 }}/{{
              days[key]?.items?.length ?? 0
            }}
            · {{ formatDuration(sumDayMinutes(days[key]?.items ?? [])) }}
          </span>
        </button>
      </li>
    </ul>
    <p v-else class="empty-hint">完成几天运动后，这里会显示历史</p>
  </section>
</template>
