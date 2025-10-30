<template>
  <div class="min-h-screen py-4 px-4 extension:min-h-0 extension:py-2">
    <div class="max-w-6xl mx-auto extension:max-w-full">
      <!-- Header -->
      <header class="text-center mb-4 md:mb-8">
        <h1 class="text-2xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">
          <span class="text-indigo-600">🌐</span> Translation App
        </h1>
        <p class="text-sm md:text-base text-gray-600">Translate text between languages instantly</p>
      </header>

      <!-- Main Translation Card -->
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Language Selection -->
        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 min-w-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select 
              v-model="sourceLang"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
            >
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.flag }} {{ lang.name }}
              </option>
            </select>
          </div>

          <!-- Swap Button -->
          <button 
            @click="swapLanguages"
            class="mt-6 p-2 bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors duration-200 flex-shrink-0"
            title="Swap languages"
          >
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <div class="flex-1 min-w-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select 
              v-model="targetLang"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
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
              class="w-full h-24 md:h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition"
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
                class="w-full h-24 md:h-40 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none outline-none"
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
            :disabled="!sourceText || isTranslating || modelLoading"
            class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            <span v-if="modelLoading" class="inline-flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Model...
            </span>
            <span v-else-if="isTranslating" class="inline-flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Translating...
            </span>
            <span v-else>Translate</span>
          </button>
        </div>
      </div>

      <!-- Model Loading Status -->
      <div v-if="modelLoading" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <svg class="animate-spin h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-blue-900">{{ loadingStatus }}</p>
            <div v-if="loadingProgress > 0" class="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: loadingProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Footer -->
      <footer class="text-center mt-8 text-gray-600 text-sm">
        <p>Powered by Transformers.js - Translation runs locally in your browser</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pipeline, env } from '@huggingface/transformers'

// Detect if running in Chrome extension
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id

// Configure based on environment
if (isExtension) {
  // Chrome extension: use local WASM files to avoid CSP issues
  env.allowLocalModels = false
  env.allowRemoteModels = true
  env.backends.onnx.wasm.wasmPaths = '/assets/'
  // Enable caching to persist model between sessions
  env.useBrowserCache = true
  env.cacheDir = 'transformers-cache'
  console.log('Running in Chrome extension mode with caching enabled')
} else {
  // Web app: disable caching to avoid issues, use CDN directly
  env.useBrowserCache = false
  console.log('Running in web app mode')
}

// Language codes for NLLB model (Facebook's No Language Left Behind)
const languages = [
  { code: 'eng_Latn', name: 'English', flag: '🇬🇧' },
  { code: 'spa_Latn', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fra_Latn', name: 'French', flag: '🇫🇷' },
  { code: 'deu_Latn', name: 'German', flag: '🇩🇪' },
  { code: 'ita_Latn', name: 'Italian', flag: '🇮🇹' },
  { code: 'por_Latn', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'rus_Cyrl', name: 'Russian', flag: '🇷🇺' },
  { code: 'jpn_Jpan', name: 'Japanese', flag: '🇯🇵' },
  { code: 'kor_Hang', name: 'Korean', flag: '🇰🇷' },
  { code: 'zho_Hans', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'arb_Arab', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hin_Deva', name: 'Hindi', flag: '🇮🇳' },
  { code: 'tur_Latn', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nld_Latn', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pol_Latn', name: 'Polish', flag: '🇵🇱' },
]

const sourceLang = ref('eng_Latn')
const targetLang = ref('spa_Latn')
const sourceText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)
const copied = ref(false)
const modelLoading = ref(false)
const loadingStatus = ref('')
const loadingProgress = ref(0)

// Translation pipeline instance
let translator = null

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

const initializeModel = async () => {
  if (translator || modelLoading.value) return // Already initialized
  
  try {
    modelLoading.value = true
    loadingStatus.value = 'Loading translation model...'
    loadingProgress.value = 0
    
    // Create translation pipeline with progress callback
    translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
      progress_callback: (progress) => {
        if (progress.status === 'downloading') {
          loadingStatus.value = `Downloading model: ${progress.file}`
          loadingProgress.value = progress.progress || 0
        } else if (progress.status === 'loading') {
          loadingStatus.value = 'Loading model into memory...'
          loadingProgress.value = 90
        } else if (progress.status === 'ready') {
          loadingStatus.value = 'Model ready!'
          loadingProgress.value = 100
        }
      }
    })
    
    // Small delay to show completion
    await new Promise(resolve => setTimeout(resolve, 500))
    modelLoading.value = false
  } catch (error) {
    console.error('Error loading model:', error)
    loadingStatus.value = 'Error loading model. Please refresh the page.'
    modelLoading.value = false
  }
}

const translate = async () => {
  if (!sourceText.value) return
  
  try {
    isTranslating.value = true
    
    // Initialize model if not already loaded
    if (!translator) {
      await initializeModel()
    }
    
    // Perform translation
    const result = await translator(sourceText.value, {
      src_lang: sourceLang.value,
      tgt_lang: targetLang.value,
    })
    
    translatedText.value = result[0].translation_text
  } catch (error) {
    console.error('Translation error:', error)
    translatedText.value = 'Error: Translation failed. Please try again.'
  } finally {
    isTranslating.value = false
  }
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

// Wait for model to be ready
const waitForModel = async () => {
  let attempts = 0
  const maxAttempts = 1500 // 5 minutes max (300 seconds)
  
  while ((!translator || modelLoading.value) && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 200))
    attempts++
  }
  
  return translator !== null
}

// Check for selected text from context menu (Chrome extension only)
const checkForSelectedText = async () => {
  if (!isExtension) return false
  
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSelectedText' })
    if (response && response.text && response.text.trim()) {
      sourceText.value = response.text
      return true
    }
  } catch (err) {
    console.log('No selected text or not in extension context')
  }
  
  return false
}

// Auto-translate when model loads if source text is present
const autoTranslateOnModelLoad = async () => {
  // Wait for model to be ready
  const modelReady = await waitForModel()

  if (modelReady) {
    await translate()
  } else {
    console.log('Model not ready yet, user can manually translate')
  }
}

// Initialize model on component mount
onMounted(async () => {
  // Start preloading the model
  initializeModel()
  
  // Check for selected text from context menu (sets sourceText if found)
  await checkForSelectedText()
  
  // Auto-translate if there's text in sourceText
  await autoTranslateOnModelLoad()
})
</script>
