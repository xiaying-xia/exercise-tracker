<script setup>
import { ref, computed } from 'vue'
import { useExerciseStore } from './composables/useExerciseStore'
import { useAppConfig } from './composables/useAppConfig'
import { formatWeekRange } from './utils/date'
import StatsBar from './components/StatsBar.vue'
import DateNav from './components/DateNav.vue'
import AddExerciseForm from './components/AddExerciseForm.vue'
import TemplatePicker from './components/TemplatePicker.vue'
import ExerciseItem from './components/ExerciseItem.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import AppTabs from './components/AppTabs.vue'
import BodyMetricsForm from './components/BodyMetricsForm.vue'
import TrendsView from './components/TrendsView.vue'
import DataBackup from './components/DataBackup.vue'

const activeTab = ref('exercise')
const { app, configSet, loadError } = useAppConfig()

const {
  store,
  selectedDateKey,
  todayKey,
  items,
  currentBody,
  dayTotalMinutes,
  weekTotalMinutes,
  completedCount,
  setSelectedDate,
  goToday,
  shiftDay,
  customTemplates,
  addItem,
  addFromTemplate,
  addCustomTemplate,
  removeCustomTemplate,
  toggleDone,
  updateItem,
  removeItem,
  getHistoryKeys,
  saveBodyMetrics,
  clearBodyMetrics,
} = useExerciseStore()

const isToday = computed(() => selectedDateKey.value === todayKey.value)
const historyKeys = computed(() => getHistoryKeys())
const weekLabel = computed(() => formatWeekRange(parseSelected()))

const showDateNav = computed(
  () => activeTab.value === 'exercise' || activeTab.value === 'body',
)

function parseSelected() {
  const [y, m, d] = selectedDateKey.value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function onAdd(name, minutes, saveAsTemplate = false) {
  addItem(name, minutes)
  if (saveAsTemplate) addCustomTemplate(name, minutes)
}

function onTemplatePick(template) {
  addFromTemplate(template)
}

function onBodySave(patch) {
  saveBodyMetrics(selectedDateKey.value, patch)
}

function onBodyClear() {
  clearBodyMetrics(selectedDateKey.value)
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <p class="app-brand">{{ app.name }}</p>
      <p v-if="loadError" class="config-warn">配置加载失败，已用内置默认</p>
      <p v-else class="config-set-hint">配置：{{ configSet }}</p>
      <p v-if="activeTab === 'exercise'" class="week-label">本周 {{ weekLabel }}</p>
      <p v-else-if="activeTab === 'body'" class="week-label">记录体重与三围</p>
      <p v-else class="week-label">查看运动与身体数据变化</p>
    </header>

    <DateNav
      v-if="showDateNav"
      :date-key="selectedDateKey"
      :is-today="isToday"
      @prev="shiftDay(-1)"
      @next="shiftDay(1)"
      @today="goToday"
    />

    <StatsBar
      v-if="activeTab === 'exercise'"
      :day-minutes="dayTotalMinutes"
      :week-minutes="weekTotalMinutes"
      :completed="completedCount"
      :total="items.length"
    />

    <main class="main">
      <!-- 运动 -->
      <template v-if="activeTab === 'exercise'">
        <template v-if="isToday">
          <TemplatePicker
            :custom-templates="customTemplates"
            @pick="onTemplatePick"
            @add-custom="addCustomTemplate"
            @remove-custom="removeCustomTemplate"
          />
          <AddExerciseForm @add="onAdd" />
        </template>
        <p v-else class="readonly-hint">查看历史日期；回到今天可添加新运动</p>

        <section class="list-section" aria-label="运动列表">
          <h2 class="section-title">运动列表</h2>
          <ul v-if="items.length" class="exercise-list">
            <ExerciseItem
              v-for="item in items"
              :key="item.id"
              :item="item"
              @toggle="toggleDone"
              @update="updateItem"
              @remove="removeItem"
            />
          </ul>
          <p v-else class="empty-hint">还没有运动项，添加一项开始打卡吧</p>
        </section>

        <HistoryPanel
          :keys="historyKeys"
          :days="store.days"
          :active-key="selectedDateKey"
          @select="setSelectedDate"
        />
      </template>

      <!-- 身体 -->
      <template v-else-if="activeTab === 'body'">
        <BodyMetricsForm
          :body="currentBody"
          :date-key="selectedDateKey"
          @save="onBodySave"
          @clear="onBodyClear"
        />
        <p class="readonly-hint">
          可切换日期补录历史；数据仅保存在本机
        </p>
      </template>

      <!-- 趋势 -->
      <TrendsView v-else-if="activeTab === 'trends'" :days="store.days" />

      <DataBackup
        v-if="activeTab === 'body'"
        @imported="() => location.reload()"
      />
    </main>

    <AppTabs v-model="activeTab" />

    <footer class="app-footer">
      <p>数据保存在本机，不会上传云端</p>
    </footer>
  </div>
</template>
