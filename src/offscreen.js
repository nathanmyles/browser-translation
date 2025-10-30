// Offscreen document for handling translations in the background
import { pipeline, env } from '@huggingface/transformers';

// Configure for Chrome extension
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;
env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('assets/');

let translator = null;
let isInitializing = false;

// Default language settings (English to French)
let sourceLang = 'eng_Latn';
let targetLang = 'fra_Latn';

// Initialize the translation model
async function initializeModel() {
  if (translator) return translator;
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return translator;
  }
  
  isInitializing = true;
  console.log('Offscreen: Loading translation model...');
  
  try {
    translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
      progress_callback: (progress) => {
        console.log('Offscreen model loading:', progress);
      }
    });
    console.log('Offscreen: Model loaded successfully');
    isInitializing = false;
    return translator;
  } catch (error) {
    console.error('Offscreen: Failed to load model:', error);
    isInitializing = false;
    throw error;
  }
}

// Perform translation
async function translate(text, srcLang, tgtLang) {
  try {
    if (!translator) {
      console.log('Offscreen: Initializing model before translation...');
      await initializeModel();
    }
    
    if (!translator) {
      throw new Error('Failed to initialize translator');
    }
    
    console.log('Offscreen: Translating text...');
    const result = await translator(text, {
      src_lang: srcLang || sourceLang,
      tgt_lang: tgtLang || targetLang,
    });
    
    console.log('Offscreen: Translation complete');
    return result[0].translation_text;
  } catch (error) {
    console.error('Offscreen: Translation error:', error);
    throw error;
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateAndReplace') {
    // Perform translation and send back to replace
    translate(request.text, request.sourceLang, request.targetLang)
      .then(translatedText => {
        // Send message to background to replace text
        chrome.runtime.sendMessage({
          action: 'replaceText',
          tabId: request.tabId,
          translatedText: translatedText
        });
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Offscreen translation error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'setLanguages') {
    sourceLang = request.sourceLang || sourceLang;
    targetLang = request.targetLang || targetLang;
    sendResponse({ success: true });
    return true;
  }
});

// Update status in the document
function updateStatus(message) {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = message;
  }
  console.log('Offscreen:', message);
}

// Initialize model on load
updateStatus('Offscreen document loaded. Initializing model...');
initializeModel()
  .then(() => {
    updateStatus('Model loaded and ready');
  })
  .catch(error => {
    updateStatus('Error loading model: ' + error.message);
  });
