# Browser Translation

A modern translation tool built with Vue 3, Tailwind CSS, and Transformers.js. Translation runs **entirely in your browser** using machine learning models - no API keys or server required!

Available as both a **web app** and a **Chrome extension**.

## Features

- ✨ **Clean and modern UI** with responsive design
- 🌍 **15+ languages** supported (English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Turkish, Dutch, Polish)
- 🤖 **AI-powered translation** using Facebook's NLLB-200 model via Transformers.js
- 🔒 **100% private** - all translation happens locally in your browser
- 📊 **Real-time progress tracking** for model loading
- 🔄 **Language swap** functionality
- 📋 **Copy to clipboard** with visual feedback
- 📏 **Character counter** for both source and translated text
- ⚡ **No API keys required** - completely free to use

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

- **Vue 3** (Composition API)
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Transformers.js** for ML-powered translation
- **NLLB-200** translation model by Meta AI

## Usage

1. Select source and target languages
2. Enter text to translate
3. Click "Translate" (the model will download on first use)
4. Copy the translation or swap languages to translate back

## Browser Compatibility

Requires a modern browser with WebAssembly support (Chrome, Firefox, Safari, Edge)
