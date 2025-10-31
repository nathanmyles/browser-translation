<template>
  <button 
    @click="$emit('click')"
    :disabled="disabled"
    :title="title"
    :class="[
      'p-2 rounded-lg shadow-sm transition-colors duration-200',
      disabled ? 'bg-gray-200 cursor-not-allowed' : `bg-white hover:${hoverColor}`
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  hoverColor: {
    type: String,
    default: 'bg-gray-100'
  }
})

defineEmits(['click'])
</script>
