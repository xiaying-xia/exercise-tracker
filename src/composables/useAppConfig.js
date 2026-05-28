import { reactive, computed } from 'vue'
import { FALLBACK_CONFIG } from '../config/fallback'

const state = reactive({
  ready: false,
  loadError: null,
  configSet: FALLBACK_CONFIG.set,
  app: { ...FALLBACK_CONFIG.app },
  templateCategories: [...FALLBACK_CONFIG.templateCategories],
  templates: [...FALLBACK_CONFIG.templates],
  bodyFields: [...FALLBACK_CONFIG.bodyFields],
})

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} (${res.status})`)
  return res.json()
}

function applyConfig(setName, app, templatesFile, bodyFile) {
  state.configSet = setName
  state.app = {
    name: app.name ?? FALLBACK_CONFIG.app.name,
    shortName: app.shortName ?? app.name ?? FALLBACK_CONFIG.app.shortName,
    description: app.description ?? '',
  }
  state.templateCategories =
    templatesFile.categories ?? FALLBACK_CONFIG.templateCategories
  state.templates = templatesFile.templates ?? FALLBACK_CONFIG.templates
  state.bodyFields = bodyFile.fields ?? FALLBACK_CONFIG.bodyFields
}

export async function loadAppConfig() {
  state.loadError = null
  let setName = FALLBACK_CONFIG.set

  try {
    const active = await fetchJson('/config/active.json')
    if (active?.set && typeof active.set === 'string') {
      setName = active.set.trim()
    }
  } catch (e) {
    console.warn('[config] active.json', e)
  }

  const base = `/config/${setName}`
  try {
    const [app, templatesFile, bodyFile] = await Promise.all([
      fetchJson(`${base}/app.json`),
      fetchJson(`${base}/templates.json`),
      fetchJson(`${base}/body-metrics.json`),
    ])
    applyConfig(setName, app, templatesFile, bodyFile)
  } catch (e) {
    console.warn(`[config] 加载 ${setName} 失败，使用内置默认`, e)
    state.loadError = String(e.message ?? e)
    applyConfig(
      FALLBACK_CONFIG.set,
      FALLBACK_CONFIG.app,
      {
        categories: FALLBACK_CONFIG.templateCategories,
        templates: FALLBACK_CONFIG.templates,
      },
      { fields: FALLBACK_CONFIG.bodyFields },
    )
  }

  state.ready = true
}

export function useAppConfig() {
  return {
    ready: computed(() => state.ready),
    loadError: computed(() => state.loadError),
    configSet: computed(() => state.configSet),
    app: computed(() => state.app),
    templateCategories: computed(() => state.templateCategories),
    templates: computed(() => state.templates),
    bodyFields: computed(() => state.bodyFields),
  }
}
