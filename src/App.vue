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
          <LanguageSelector 
            v-model="sourceLang" 
            label="From" 
            :languages="languages" 
          />

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

          <LanguageSelector 
            v-model="targetLang" 
            label="To" 
            :languages="languages" 
          />
        </div>

        <!-- Translation Areas -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Source Text -->
          <TranslationTextArea
            v-model="sourceText"
            label="Source Text"
            placeholder="Enter text to translate..."
            @update:modelValue="handleInput"
          >
            <template #actions>
              <IconButton 
                @click="clearText"
                hover-color="bg-red-50"
                title="Clear text"
              >
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </IconButton>
            </template>
          </TranslationTextArea>

          <!-- Translated Text -->
          <TranslationTextArea
            v-model="translatedText"
            label="Translation"
            placeholder="Translation will appear here..."
            readonly
          >
            <template #actions>
              <div class="flex gap-2">
                <IconButton 
                  @click="speakTranslation"
                  :disabled="isSpeaking || isLoadingTTS"
                  title="Speak translation"
                >
                  <LoadingSpinner v-if="isLoadingTTS" class="text-blue-600" />
                  <svg v-else-if="isSpeaking" class="w-5 h-5 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </IconButton>
                <IconButton 
                  @click="copyToClipboard"
                  title="Copy to clipboard"
                >
                  <svg v-if="!copied" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </IconButton>
              </div>
            </template>
            <template #footer>
              <span v-if="copied" class="text-sm text-green-600">Copied!</span>
            </template>
          </TranslationTextArea>
        </div>

        <!-- Translate Button -->
        <div class="mt-6 text-center">
          <button 
            @click="translate"
            :disabled="!sourceText || isTranslating || modelLoading"
            class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            <span v-if="isTranslating" class="inline-flex items-center justify-center gap-2">
              <LoadingSpinner />
              Translating...
            </span>
            <span v-else-if="modelLoading" class="inline-flex items-center justify-center gap-2">
              <LoadingSpinner />
              Loading Model...
            </span>
            <span v-else>Translate</span>
          </button>
        </div>
      </div>

      <!-- Model Loading Status -->
      <ModelLoadingStatus 
        :is-loading="modelLoading"
        :status="loadingStatus"
        :file-progress="fileProgress"
      />

      <!-- Info Footer -->
      <footer class="text-center mt-8 text-gray-600 text-sm">
        <p>Powered by Transformers.js - Translation runs locally in your browser</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { pipeline, env } from '@huggingface/transformers'
import LanguageSelector from './components/LanguageSelector.vue'
import TranslationTextArea from './components/TranslationTextArea.vue'
import IconButton from './components/IconButton.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ModelLoadingStatus from './components/ModelLoadingStatus.vue'

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
const targetLang = ref('fra_Latn')
const sourceText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)
const copied = ref(false)
const modelLoading = ref(false)
const loadingStatus = ref('')
const loadingProgress = ref(0)
const fileProgress = ref({})
const isSpeaking = ref(false)
const isLoadingTTS = ref(false)

// Translation pipeline instance
let translator = null
let ttsModel = null
let currentAudio = null

const swapLanguages = () => {
  const temp = sourceLang.value
  sourceLang.value = targetLang.value
  targetLang.value = temp
  
  const tempText = sourceText.value
  sourceText.value = translatedText.value
  translatedText.value = tempText
  
  // Save the new language selections
  saveLanguagePreferences()
}

// Save language preferences
const saveLanguagePreferences = () => {
  const preferences = {
    sourceLang: sourceLang.value,
    targetLang: targetLang.value
  }
  
  if (isExtension) {
    chrome.storage.local.set({ languagePreferences: preferences })
  } else {
    localStorage.setItem('languagePreferences', JSON.stringify(preferences))
  }
}

// Load language preferences
const loadLanguagePreferences = async () => {
  try {
    if (isExtension) {
      const result = await chrome.storage.local.get(['languagePreferences'])
      if (result.languagePreferences) {
        sourceLang.value = result.languagePreferences.sourceLang || sourceLang.value
        targetLang.value = result.languagePreferences.targetLang || targetLang.value
      }
    } else {
      const saved = localStorage.getItem('languagePreferences')
      if (saved) {
        const preferences = JSON.parse(saved)
        sourceLang.value = preferences.sourceLang || sourceLang.value
        targetLang.value = preferences.targetLang || targetLang.value
      }
    }
  } catch (err) {
    console.log('Could not load language preferences:', err)
  }
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
        if (progress.status === 'initiate') {
          loadingStatus.value = `Initializing model download...`
          if (progress.file) {
            fileProgress.value[progress.file] = { progress: 0, status: 'initiate' }
          }
        } else if (progress.status === 'download' || progress.status === 'progress') {
          loadingStatus.value = `Downloading model files...`
          if (progress.file) {
            fileProgress.value[progress.file] = { 
              progress: progress.progress || 0, 
              status: 'downloading' 
            }
          }
        } else if (progress.status === 'done') {
          if (progress.file) {
            fileProgress.value[progress.file] = { progress: 100, status: 'done' }
          }
        } else if (progress.status === 'loading') {
          loadingStatus.value = 'Loading model into memory...'
        } else if (progress.status === 'ready') {
          loadingStatus.value = 'Model ready!'
          // Mark all files as complete
          Object.keys(fileProgress.value).forEach(file => {
            fileProgress.value[file] = { progress: 100, status: 'done' }
          })
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
    
    // Give the browser time to update the UI before blocking with translation
    await new Promise(resolve => setTimeout(resolve, 50))
    
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

const speakTranslation = async () => {
  if (!translatedText.value || isSpeaking.value || isLoadingTTS.value) return
  
  try {
    isLoadingTTS.value = true
    
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    
    // Map NLLB language codes to MMS-TTS language codes
    const langMap = {
      'eng_Latn': 'eng',
      'spa_Latn': 'spa',
      'fra_Latn': 'fra',
      'deu_Latn': 'deu',
      'ita_Latn': 'ita',
      'por_Latn': 'por',
      'rus_Cyrl': 'rus',
      'jpn_Jpan': 'jpn',
      'kor_Hang': 'kor',
      'zho_Hans': 'cmn',
      'arb_Arab': 'ara',
      'hin_Deva': 'hin',
      'tur_Latn': 'tur',
      'nld_Latn': 'nld',
      'pol_Latn': 'pol',
    }
    
    const ttsLang = langMap[targetLang.value] || 'eng'
    const modelName = `Xenova/mms-tts-${ttsLang}`
    
    // Initialize TTS model if not loaded or language changed
    if (!ttsModel || ttsModel.modelName !== modelName) {
      console.log(`Loading TTS model: ${modelName}`)
      ttsModel = await pipeline('text-to-speech', modelName, {
        quantized: false, // Remove this line to use the quantized version (default)
      })
      ttsModel.modelName = modelName // Store model name for comparison
    }
    
    // Generate speech
    const output = await ttsModel(translatedText.value)
    
    // Switch from loading to speaking
    isLoadingTTS.value = false
    isSpeaking.value = true
    
    // Create audio context and play
    const audioContext = new AudioContext()
    const audioBuffer = audioContext.createBuffer(
      1,
      output.audio.length,
      output.sampling_rate
    )
    
    const channelData = audioBuffer.getChannelData(0)
    channelData.set(output.audio)
    
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    
    source.onended = () => {
      isSpeaking.value = false
      currentAudio = null
    }
    
    source.start()
    currentAudio = source
    
  } catch (error) {
    console.error('TTS error:', error)
    isLoadingTTS.value = false
    isSpeaking.value = false
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

// Store tab ID for text replacement
let contextTabId = null

// Check for selected text from context menu (Chrome extension only)
const checkForSelectedText = async () => {
  if (!isExtension) return false
  
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSelectedText' })
    if (response && response.text && response.text.trim()) {
      sourceText.value = response.text
      contextTabId = response.tabId
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
    // Note: We no longer auto-replace text from the popup
    // The "Replace with translation" context menu option handles that via offscreen document
  } else {
    console.log('Model not ready yet, user can manually translate')
  }
}

// Watch for language changes and save preferences
watch([sourceLang, targetLang], () => {
  saveLanguagePreferences()
  
  // Also update offscreen document if in extension mode
  if (isExtension) {
    chrome.runtime.sendMessage({
      action: 'setLanguages',
      sourceLang: sourceLang.value,
      targetLang: targetLang.value
    }).catch(() => {
      // Offscreen document might not be loaded yet, that's okay
    })
  }
})

// Initialize model on component mount
onMounted(async () => {
  // Load saved language preferences first
  await loadLanguagePreferences()
  
  // Start preloading the model
  initializeModel()
  
  // Check for selected text from context menu (sets sourceText if found)
  await checkForSelectedText()
  
  // Auto-translate if there's text in sourceText
  await autoTranslateOnModelLoad()
})
</script>
