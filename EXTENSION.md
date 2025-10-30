# Chrome Extension Guide

## Quick Start

### 1. Build the Extension

```bash
npm install
npm run build:extension
```

### 2. Create Icons (Required)

The extension needs three PNG icons. Choose one method:

#### Option A: Use an online converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `public/icon.svg`
3. Convert to PNG at sizes: 16x16, 48x48, 128x128
4. Save as `public/icon-16.png`, `public/icon-48.png`, `public/icon-128.png`

#### Option B: Use ImageMagick (if installed)
```bash
cd public
convert icon.svg -resize 16x16 icon-16.png
convert icon.svg -resize 48x48 icon-48.png
convert icon.svg -resize 128x128 icon-128.png
```

#### Option C: Skip icons temporarily
Edit `public/manifest.json` and remove the `icons` section. Chrome will use a default icon.

### 3. Rebuild with Icons

```bash
npm run build:extension
```

### 4. Load in Chrome

1. Open Chrome and navigate to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `dist` folder from this project
5. Done! The extension icon will appear in your toolbar

### 5. Use the Extension

- Click the extension icon in your Chrome toolbar
- The translation popup will open (500x600px)
- On first use, the AI model will download (~300MB)
- Progress bar shows download status
- Model is cached for future use

## Features

- ✅ Works offline after initial model download
- ✅ 100% private - no data sent to servers
- ✅ 15+ languages supported
- ✅ Fast translations using local AI model
- ✅ Clean popup interface

## Troubleshooting

### Icons not showing
- Make sure PNG files exist in `public/` folder
- Check that `post-build.js` script ran successfully
- Verify icons are copied to `dist/` folder

### Model won't download
- Check browser console for errors
- Ensure you have internet connection for first download
- Model files come from huggingface.co CDN
- Try disabling other extensions that might block requests

### Extension won't load
- Check `dist/manifest.json` exists
- Verify all required files are in `dist/`
- Look for errors in Chrome's extension page
- Try rebuilding: `npm run build:extension`

### Popup is too small/large
- Edit `src/style.css` and adjust the media query dimensions
- Rebuild the extension

## Development

To develop the extension:

```bash
# Make changes to source files
npm run build:extension

# Reload extension in Chrome
# Go to chrome://extensions/
# Click the reload icon on your extension card
```

## Publishing to Chrome Web Store

1. Create high-quality icons (128x128 minimum)
2. Add screenshots and promotional images
3. Write a detailed description
4. Create a developer account at https://chrome.google.com/webstore/devconsole
5. Pay one-time $5 registration fee
6. Upload the `dist` folder as a ZIP file
7. Fill out store listing details
8. Submit for review

## File Structure

```
dist/
├── index.html          # Main popup HTML
├── manifest.json       # Extension configuration
├── icon-16.png        # Toolbar icon
├── icon-48.png        # Extension management icon
├── icon-128.png       # Chrome Web Store icon
└── assets/            # Compiled JS and CSS
```

## Notes

- The extension uses Manifest V3 (latest Chrome extension format)
- WebAssembly is enabled via CSP policy in manifest
- Model files are cached by the browser automatically
- Extension works in all Chromium-based browsers (Edge, Brave, etc.)
