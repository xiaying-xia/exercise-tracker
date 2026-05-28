<script setup>
import { ref, watch } from 'vue'
import { useAppConfig } from '../composables/useAppConfig'

const { bodyFields } = useAppConfig()

const props = defineProps({
  body: { type: Object, required: true },
  dateKey: { type: String, required: true },
})

const emit = defineEmits(['save', 'clear'])

const form = ref({})

function syncFromBody() {
  const next = {}
  for (const f of bodyFields.value) {
    next[f.key] =
      props.body[f.key] != null ? String(props.body[f.key]) : ''
  }
  form.value = next
}

watch(() => [props.dateKey, props.body], syncFromBody, { immediate: true, deep: true })

function submit() {
  const patch = {}
  for (const f of bodyFields.value) {
    patch[f.key] = form.value[f.key]
  }
  emit('save', patch)
}

function onClear() {
  if (confirm('确定清除这一天的体重与三围记录？')) {
    emit('clear')
    syncFromBody()
  }
}
</script>

<template>
  <section class="body-form card">
    <h2 class="section-title">体重 · 三围</h2>
    <p class="body-hint">单位：体重 kg，三围 cm。留空则不记录该项。</p>

    <form @submit.prevent="submit">
      <div class="body-grid">
        <label v-for="field in bodyFields" :key="field.key" class="body-field">
          <span class="body-label">{{ field.label }}</span>
          <div class="body-input-wrap">
            <input
              v-model="form[field.key]"
              type="number"
              class="input body-input"
              :placeholder="field.placeholder"
              :step="field.step"
              min="0"
              inputmode="decimal"
            />
            <span class="body-unit">{{ field.unit }}</span>
          </div>
        </label>
      </div>
      <button type="submit" class="btn-primary">保存记录</button>
      <button type="button" class="btn-ghost" @click="onClear">清除当天身体数据</button>
    </form>
  </section>
</template>
