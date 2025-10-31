<template>
  <div class="flex-1 min-w-0">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <select 
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
    >
      <option v-for="lang in languages" :key="lang.code" :value="lang.code">
        {{ lang.flag }} {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  languages: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>
