<template>
  <div v-if="isLoading" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <LoadingSpinner class="text-blue-600 flex-shrink-0 mt-0.5" />
      <div class="flex-1 min-w-0 space-y-3">
        <p class="text-sm font-medium text-blue-900">{{ status }}</p>
        <!-- Individual file progress bars -->
        <div v-for="(file, filename) in fileProgress" :key="filename" class="space-y-1">
          <div class="flex justify-between items-center text-xs">
            <span class="text-blue-800 font-mono truncate">{{ filename }}</span>
            <span class="text-blue-600 ml-2 flex-shrink-0">{{ Math.round(file.progress) }}%</span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-1.5">
            <div 
              class="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
              :style="{ width: file.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  isLoading: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    default: ''
  },
  fileProgress: {
    type: Object,
    default: () => ({})
  }
})
</script>
