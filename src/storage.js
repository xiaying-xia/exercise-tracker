const STORAGE_KEY = 'exercise-tracker-v1'

function emptyStore() {
  return { days: {}, customTemplates: [] }
}

function normalizeStore(parsed) {
  const store = emptyStore()
  if (!parsed || typeof parsed !== 'object') return store
  if (parsed.days && typeof parsed.days === 'object') store.days = parsed.days
  if (Array.isArray(parsed.customTemplates)) {
    store.customTemplates = parsed.customTemplates
      .filter((t) => t?.name && typeof t.name === 'string')
      .map((t) => ({
        id: t.id || createId(),
        name: t.name.trim(),
        minutes:
          t.minutes == null || t.minutes === ''
            ? null
            : Math.max(0, Number(t.minutes)) || null,
      }))
  }
  return store
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    return normalizeStore(JSON.parse(raw))
  } catch {
    return emptyStore()
  }
}

export function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ensureDay(store, dateKey) {
  if (!store.days[dateKey]) {
    store.days[dateKey] = { items: [] }
  }
  if (!Array.isArray(store.days[dateKey].items)) {
    store.days[dateKey].items = []
  }
  return store.days[dateKey]
}
