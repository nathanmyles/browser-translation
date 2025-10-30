# 🚀 Quick Start Guide

## For Chrome Extension

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Icons (Choose ONE method)

#### Method A: Use the HTML Icon Generator (Easiest!)
1. Open `scripts/create-placeholder-icons.html` in your browser
2. Click "Generate Icons"
3. Download all three icons (16x16, 48x48, 128x128)
4. Save them in the `public/` folder as:
   - `icon-16.png`
   - `icon-48.png`
   - `icon-128.png`

#### Method B: Skip Icons (Temporary)
1. Open `public/manifest.json`
2. Delete the entire `"icons": { ... }` section
3. Chrome will use a default icon

### Step 3: Build the Extension
```bash
npm run build:extension
```

### Step 4: Load in Chrome
1. Open Chrome → `chrome://extensions/`
2. Enable **"Developer mode"** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `dist` folder
5. Done! 🎉

### Step 5: Use It
- Click the extension icon in your toolbar
- Enter text and translate
- First use downloads the AI model (~300MB)
- Subsequent uses are instant!

---

## For Web App

### Development
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

---

## Troubleshooting

**Extension won't load?**
- Make sure you ran `npm run build:extension`
- Check that `dist/manifest.json` exists
- Look for errors on the `chrome://extensions/` page

**Icons missing?**
- Use the HTML generator in `scripts/create-placeholder-icons.html`
- Or remove the icons section from `manifest.json`

**Model won't download?**
- Check your internet connection
- Open browser console (F12) to see errors
- Model downloads from huggingface.co

**Need help?**
- See `EXTENSION.md` for detailed guide
- See `public/ICONS.md` for icon instructions
- Check the browser console for errors

---

## What's Next?

- Customize the UI in `src/App.vue`
- Add more languages in the languages array
- Change the model in `initializeModel()` function
- Publish to Chrome Web Store (see `EXTENSION.md`)

Enjoy your AI-powered translation extension! 🌐✨
