<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          <span class="text-indigo-600">🌐</span> Translation App
        </h1>
        <p class="text-gray-600">Translate text between languages instantly</p>
      </header>

      <!-- Main Translation Card -->
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Language Selection -->
        <div class="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div class="flex-1 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select 
              v-model="sourceLang"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            >
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.flag }} {{ lang.name }}
              </option>
            </select>
          </div>

          <!-- Swap Button -->
          <button 
            @click="swapLanguages"
            class="mt-6 md:mt-6 p-3 bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors duration-200"
            title="Swap languages"
          >
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <div class="flex-1 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select 
              v-model="targetLang"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            >
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.flag }} {{ lang.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Translation Areas -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Source Text -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Source Text</label>
            <textarea
              v-model="sourceText"
              @input="handleInput"
              placeholder="Enter text to translate..."
              class="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition"
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-500">{{ sourceText.length }} characters</span>
              <button 
                v-if="sourceText"
                @click="clearText"
                class="text-sm text-red-500 hover:text-red-700 transition"
              >
                Clear
              </button>
            </div>
          </div>

          <!-- Translated Text -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Translation</label>
            <div class="relative">
              <textarea
                v-model="translatedText"
                readonly
                placeholder="Translation will appear here..."
                class="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none outline-none"
              ></textarea>
              <button 
                v-if="translatedText"
                @click="copyToClipboard"
                class="absolute top-3 right-3 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm transition-colors duration-200"
                title="Copy to clipboard"
              >
                <svg v-if="!copied" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-500">{{ translatedText.length }} characters</span>
              <span v-if="copied" class="text-sm text-green-600">Copied!</span>
            </div>
          </div>
        </div>

        <!-- Translate Button -->
        <div class="mt-6 text-center">
          <button 
            @click="translate"
            :disabled="!sourceText || isTranslating"
            class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            <span v-if="!isTranslating">Translate</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Translating...
            </span>
          </button>
        </div>
      </div>

      <!-- Info Footer -->
      <footer class="text-center mt-8 text-gray-600 text-sm">
        <p>Note: This is a UI demo. Connect to a translation API for actual translations.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
]

const sourceLang = ref('en')
const targetLang = ref('es')
const sourceText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)
const copied = ref(false)

const swapLanguages = () => {
  const temp = sourceLang.value
  sourceLang.value = targetLang.value
  targetLang.value = temp
  
  const tempText = sourceText.value
  sourceText.value = translatedText.value
  translatedText.value = tempText
}

const handleInput = () => {
  // Auto-translate could be implemented here with debouncing
}

const translate = async () => {
  if (!sourceText.value) return
  
  isTranslating.value = true
  
  // Simulate API call - Replace this with actual translation API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Demo translation (just reverses the text as placeholder)
  translatedText.value = `[${targetLang.value.toUpperCase()}] ${sourceText.value}`
  
  isTranslating.value = false
}

const clearText = () => {
  sourceText.value = ''
  translatedText.value = ''
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(translatedText.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
