import { reactive, computed, watch } from 'vue'
import {
  loadStore,
  saveStore,
  createId,
  ensureDay,
} from '../storage'
import { formatDateKey, getWeekDateKeys } from '../utils/date'
import { sumDayMinutes, sumWeekMinutes } from '../utils/stats'
import { normalizeBody, hasAnyBody } from '../utils/body'
import { useAppConfig } from './useAppConfig'

const store = reactive(loadStore())
const selectedDateKey = reactive({ value: formatDateKey() })

watch(
  store,
  () => {
    saveStore(store)
  },
  { deep: true },
)

export function useExerciseStore() {
  const { bodyFields } = useAppConfig()
  const todayKey = computed(() => formatDateKey())

  const currentDay = computed(() => ensureDay(store, selectedDateKey.value))

  const items = computed(() => currentDay.value.items)

  const currentBody = computed(() =>
    normalizeBody(currentDay.value.body, bodyFields.value),
  )

  const weekKeys = computed(() => getWeekDateKeys(parseSelectedDate()))

  const dayTotalMinutes = computed(() => sumDayMinutes(items.value))

  const weekTotalMinutes = computed(() =>
    sumWeekMinutes(store.days, weekKeys.value),
  )

  const completedCount = computed(
    () => items.value.filter((i) => i.done).length,
  )

  function parseSelectedDate() {
    const [y, m, d] = selectedDateKey.value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }

  function setSelectedDate(key) {
    selectedDateKey.value = key
    ensureDay(store, key)
  }

  function goToday() {
    setSelectedDate(formatDateKey())
  }

  function shiftDay(delta) {
    const d = parseSelectedDate()
    d.setDate(d.getDate() + delta)
    setSelectedDate(formatDateKey(d))
  }

  function parseMinutes(minutes) {
    if (minutes === '' || minutes == null) return null
    const n = Math.max(0, Number(minutes))
    return n === 0 ? null : n
  }

  function addItem(name, minutes = null) {
    const trimmed = name.trim()
    if (!trimmed) return false
    currentDay.value.items.push({
      id: createId(),
      name: trimmed,
      minutes: parseMinutes(minutes),
      done: false,
    })
    return true
  }

  function addFromTemplate({ name, minutes = null }) {
    return addItem(name, minutes)
  }

  function addCustomTemplate(name, minutes = null) {
    const trimmed = name.trim()
    if (!trimmed) return false
    const exists = store.customTemplates.some((t) => t.name === trimmed)
    if (exists) return false
    store.customTemplates.push({
      id: createId(),
      name: trimmed,
      minutes: parseMinutes(minutes),
    })
    return true
  }

  function removeCustomTemplate(id) {
    const idx = store.customTemplates.findIndex((t) => t.id === id)
    if (idx >= 0) store.customTemplates.splice(idx, 1)
  }

  function toggleDone(id) {
    const item = currentDay.value.items.find((i) => i.id === id)
    if (item) item.done = !item.done
  }

  function updateItem(id, patch) {
    const item = currentDay.value.items.find((i) => i.id === id)
    if (!item) return
    if (patch.name !== undefined) item.name = patch.name.trim() || item.name
    if (patch.minutes !== undefined) {
      item.minutes = parseMinutes(patch.minutes)
    }
    if (patch.done !== undefined) item.done = patch.done
  }

  function removeItem(id) {
    const idx = currentDay.value.items.findIndex((i) => i.id === id)
    if (idx >= 0) currentDay.value.items.splice(idx, 1)
  }

  function getHistoryKeys() {
    return Object.keys(store.days)
      .filter((k) => {
        const day = store.days[k]
        return (
          (day?.items?.length ?? 0) > 0 ||
          hasAnyBody(day?.body, bodyFields.value)
        )
      })
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 30)
  }

  function saveBodyMetrics(dateKey, patch) {
    const day = ensureDay(store, dateKey)
    const next = normalizeBody({ ...day.body, ...patch }, bodyFields.value)
    if (hasAnyBody(next, bodyFields.value)) {
      day.body = next
    } else {
      delete day.body
    }
  }

  function clearBodyMetrics(dateKey) {
    const day = store.days[dateKey]
    if (day) delete day.body
  }

  return {
    store,
    selectedDateKey: computed(() => selectedDateKey.value),
    todayKey,
    items,
    currentBody,
    weekKeys,
    dayTotalMinutes,
    weekTotalMinutes,
    completedCount,
    setSelectedDate,
    goToday,
    shiftDay,
    customTemplates: computed(() => store.customTemplates),
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
  }
}
