<script setup>
import { ref, computed } from 'vue'
import { useAppConfig } from '../composables/useAppConfig'

const props = defineProps({
  customTemplates: { type: Array, default: () => [] },
})

const { templateCategories, templates } = useAppConfig()

const emit = defineEmits(['pick', 'add-custom', 'remove-custom'])

const open = ref(false)
const manageOpen = ref(false)
const customName = ref('')
const customMinutes = ref('')

const groupedBuiltins = computed(() => {
  const map = Object.fromEntries(
    templateCategories.value.map((c) => [c.id, []]),
  )
  for (const t of templates.value) {
    if (map[t.category]) map[t.category].push(t)
  }
  return templateCategories.value
    .map((cat) => ({
      ...cat,
      items: map[cat.id] ?? [],
    }))
    .filter((g) => g.items.length > 0)
})

function labelFor(template) {
  if (template.minutes != null && template.minutes > 0) {
    return `${template.name} · ${template.minutes}分`
  }
  return template.name
}

function onPick(template) {
  emit('pick', { name: template.name, minutes: template.minutes ?? null })
}

function submitCustom() {
  const name = customName.value.trim()
  if (!name) return
  emit('add-custom', name, customMinutes.value)
  customName.value = ''
  customMinutes.value = ''
}
</script>

<template>
  <section class="template-picker">
    <button
      type="button"
      class="template-toggle"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span>从模板添加（可选）</span>
      <span class="toggle-icon">{{ open ? '▾' : '▸' }}</span>
    </button>

    <div v-show="open" class="template-body">
      <p class="template-hint">点一下即可加入今日列表；时长可之后在列表里改</p>

      <div
        v-for="group in groupedBuiltins"
        :key="group.id"
        class="template-group"
      >
        <h3 class="template-group-label">{{ group.label }}</h3>
        <div class="template-chips" role="list">
          <button
            v-for="item in group.items"
            :key="item.name"
            type="button"
            class="template-chip"
            role="listitem"
            @click="onPick(item)"
          >
            {{ labelFor(item) }}
          </button>
        </div>
      </div>

      <div v-if="customTemplates.length" class="template-group">
        <h3 class="template-group-label">我的模板</h3>
        <div class="template-chips">
          <button
            v-for="item in customTemplates"
            :key="item.id"
            type="button"
            class="template-chip custom"
            @click="onPick(item)"
          >
            {{ labelFor(item) }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="manage-toggle"
        @click="manageOpen = !manageOpen"
      >
        {{ manageOpen ? '收起' : '管理我的模板' }}
      </button>

      <div v-show="manageOpen" class="manage-panel">
        <form class="custom-template-form" @submit.prevent="submitCustom">
          <div class="add-row">
            <input
              v-model="customName"
              type="text"
              class="input name-input"
              placeholder="自定义名称"
              maxlength="40"
            />
            <div class="minutes-wrap">
              <input
                v-model="customMinutes"
                type="number"
                class="input minutes-input"
                placeholder="分钟"
                min="0"
                max="600"
                inputmode="numeric"
              />
              <span class="minutes-suffix">分钟</span>
            </div>
          </div>
          <button
            type="submit"
            class="btn-secondary"
            :disabled="!customName.trim()"
          >
            保存到我的模板
          </button>
        </form>

        <ul v-if="customTemplates.length" class="custom-list">
          <li v-for="item in customTemplates" :key="item.id">
            <span>{{ labelFor(item) }}</span>
            <button
              type="button"
              class="btn-text danger"
              @click="emit('remove-custom', item.id)"
            >
              删除
            </button>
          </li>
        </ul>
        <p v-else class="empty-hint small">还没有自定义模板</p>
      </div>
    </div>
  </section>
</template>
