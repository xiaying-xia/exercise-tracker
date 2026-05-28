<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const name = ref('')
const minutes = ref('')
const saveAsTemplate = ref(false)

function submit() {
  if (!name.value.trim()) return
  emit('add', name.value, minutes.value, saveAsTemplate.value)
  name.value = ''
  minutes.value = ''
  saveAsTemplate.value = false
}
</script>

<template>
  <form class="add-form" @submit.prevent="submit">
    <div class="add-row">
      <input
        v-model="name"
        type="text"
        class="input name-input"
        placeholder="运动名称，如：跑步"
        maxlength="40"
        autocomplete="off"
        enterkeyhint="done"
      />
      <div class="minutes-wrap">
        <input
          v-model="minutes"
          type="number"
          class="input minutes-input"
          placeholder="分钟"
          min="0"
          max="600"
          inputmode="numeric"
          enterkeyhint="done"
        />
        <span class="minutes-suffix">分钟</span>
      </div>
    </div>
    <p class="add-hint">时长可选；打勾后才会计入今日/本周总时长</p>
    <label class="save-template">
      <input v-model="saveAsTemplate" type="checkbox" />
      同时保存到我的模板
    </label>
    <button type="submit" class="btn-primary" :disabled="!name.trim()">
      添加运动
    </button>
  </form>
</template>
