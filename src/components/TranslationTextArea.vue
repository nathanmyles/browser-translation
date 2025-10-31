<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div 
      class="relative" 
      @mouseenter="focused = true" 
      @mouseleave="focused = false"
    >
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
        :placeholder="placeholder"
        :readonly="readonly"
        :class="[
          'w-full h-24 md:h-40 px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none transition',
          readonly ? 'bg-gray-50' : 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
        ]"
      ></textarea>
      
      <!-- Action buttons slot -->
      <div v-if="modelValue && focused && $slots.actions" class="absolute top-3 right-3">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <!-- Footer slot -->
    <div v-if="$slots.footer" class="flex justify-end items-center mt-2">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const focused = ref(false)
</script>
