<script setup>
defineProps({
  modelValue: { type: String, required: true },
})

defineEmits(['update:modelValue'])

const tabs = [
  { id: 'exercise', label: '运动', icon: '🏃' },
  { id: 'body', label: '身体', icon: '📏' },
  { id: 'trends', label: '趋势', icon: '📊' },
]
</script>

<template>
  <nav class="app-tabs" aria-label="主导航">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="tab-btn"
      :class="{ active: modelValue === tab.id }"
      @click="$emit('update:modelValue', tab.id)"
    >
      <span class="tab-icon" aria-hidden="true">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>
