# Browser Translation App

A modern web app for translating text built with Vue 3, Tailwind CSS, and Transformers.js. Translation runs **entirely in your browser** using machine learning models - no API keys or server required!

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

## How It Works

This app uses [Transformers.js](https://huggingface.co/docs/transformers.js) to run Facebook's NLLB-200-distilled-600M translation model directly in your browser using WebAssembly. The first time you translate text, the model will be downloaded and cached locally (~300MB). Subsequent translations will be instant!

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

3. Build for production:
```bash
npm run build
```

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
