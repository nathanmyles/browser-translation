# Browser Translation

A Chrome extension that provides **AI-powered translation running entirely locally in your browser** using Transformers.js and the NLLB-200 model. No data is sent to external servers - everything happens on your device.

Also available as a **standalone web app**.

## Features

### Translation Methods
- 🔄 **"Translate '[text]'"** - Right-click selected text to open popup with translation
- ⚡ **"Replace with translation"** - Instantly replaces selected text on the webpage without opening UI
- 🎯 **Context menu integration** - Quick access from any selected text

### Language Support
- 🌍 **15 languages** - English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese (Simplified), Arabic, Hindi, Turkish, Dutch, Polish
- 🎨 **Visual language selection** - Context menu with flags and current selection indicators
- 💾 **Remembers preferences** - Your language choices are saved across sessions
- 🔄 **Language swap** - Quickly reverse translation direction

### Text-to-Speech
- 🔊 **Multilingual TTS** - Hear translations spoken in the target language
- 🎙️ **15 language models** - Automatically uses correct MMS-TTS model
- ⏳ **Visual feedback** - Loading spinner and speaking indicator

### Privacy & Performance
- 🔒 **100% private** - All translation happens locally in your browser
- 📦 **Offline capable** - Works without internet after initial model download
- 🚫 **No tracking** - No data collection or external API calls
- ⚡ **Fast** - Models cached locally for instant subsequent translations

## 🚀 Quick Start

**Want to get started fast?** See [QUICK_START.md](QUICK_START.md) for the fastest way to build and install the Chrome extension!

## How It Works

This app uses [Transformers.js](https://huggingface.co/docs/transformers.js) to run Facebook's NLLB-200-distilled-600M translation model directly in your browser using WebAssembly. The first time you translate text, the model will be downloaded and cached locally (~300MB). Subsequent translations will be instant!

## Setup

### Prerequisites

```bash
npm install
```

### Option 1: Run as Web App

1. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

2. Build for production:
```bash
npm run build
```

### Option 2: Install as Chrome Extension

1. Build the extension:
```bash
npm run build:extension
```

2. **Prepare icons** (required):
   - See `public/ICONS.md` for instructions
   - You need `icon-16.png`, `icon-48.png`, and `icon-128.png` in the `public/` folder
   - Or temporarily remove the `icons` section from `public/manifest.json`

3. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - The extension icon will appear in your toolbar!

4. **Use the extension**:
   - Click the extension icon in your Chrome toolbar
   - The translation popup will open
   - First use will download the model (~300MB)

## Tech Stack

- **Vue 3** (Composition API) - Reactive UI framework
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tooling
- **Transformers.js** - Run ML models in the browser
- **NLLB-200-distilled-600M** - Translation model by Meta AI
- **MMS-TTS** - Multilingual text-to-speech models
- **Chrome Extension Manifest V3** - Modern extension architecture

## Usage

### As Chrome Extension

1. **Select text** on any webpage
2. **Right-click** to open context menu
3. Choose an option:
   - **"Translate '[text]'"** - Opens popup with translation, copy button, and text-to-speech
   - **"Replace with translation"** - Instantly replaces the selected text on the page
4. **Change languages** via context menu:
   - **"Translate From"** - Select source language
   - **"Translate To"** - Select target language

### As Web App

1. Open the app in your browser
2. Select source and target languages from dropdowns
3. Enter or paste text to translate
4. Click "Translate" button
5. Use copy button or text-to-speech to hear the translation

### First Use

The first time you use the extension, the translation model (~300MB) and TTS models will be downloaded and cached. This may take a few minutes depending on your connection. After that, all translations work offline and are instant!

## Architecture

- **Popup (Vue.js)** - Main UI for viewing translations with copy and TTS features
- **Offscreen Document** - Handles background translations for instant text replacement
- **Background Service Worker** - Manages context menus, coordinates components, and handles language preferences
- **Content Script** - Handles text replacement on web pages

## Browser Compatibility

- **Chrome/Edge** - Full support (Manifest V3)
- **Web app** - Any modern browser with WebAssembly support (Chrome, Firefox, Safari, Edge)
