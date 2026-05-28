<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['toggle', 'update', 'remove'])

const editing = ref(false)
const editName = ref(props.item.name)
const editMinutes = ref(
  props.item.minutes != null ? String(props.item.minutes) : '',
)

watch(
  () => props.item.id,
  () => {
    editName.value = props.item.name
    editMinutes.value =
      props.item.minutes != null ? String(props.item.minutes) : ''
    editing.value = false
  },
)

function saveEdit() {
  emit('update', props.item.id, {
    name: editName.value,
    minutes: editMinutes.value,
  })
  editing.value = false
}

function cancelEdit() {
  editName.value = props.item.name
  editMinutes.value =
    props.item.minutes != null ? String(props.item.minutes) : ''
  editing.value = false
}
</script>

<template>
  <li class="exercise-item" :class="{ done: item.done }">
    <button
      type="button"
      class="check-btn"
      :aria-pressed="item.done"
      :aria-label="item.done ? '标记未完成' : '标记完成'"
      @click="emit('toggle', item.id)"
    >
      <span class="check-icon">{{ item.done ? '✓' : '' }}</span>
    </button>

    <div v-if="!editing" class="item-body" @click="editing = true">
      <span class="item-name">{{ item.name }}</span>
      <span v-if="item.minutes != null" class="item-minutes">
        {{ item.minutes }} 分钟
      </span>
      <span v-else class="item-minutes muted">未填时长</span>
    </div>

    <div v-else class="item-edit" @click.stop>
      <input v-model="editName" class="input edit-name" type="text" />
      <input
        v-model="editMinutes"
        class="input edit-minutes"
        type="number"
        placeholder="分钟"
        min="0"
        max="600"
      />
      <div class="edit-actions">
        <button type="button" class="btn-text" @click="saveEdit">保存</button>
        <button type="button" class="btn-text muted" @click="cancelEdit">
          取消
        </button>
      </div>
    </div>

    <button
      type="button"
      class="delete-btn"
      aria-label="删除"
      @click="emit('remove', item.id)"
    >
      ×
    </button>
  </li>
</template>
