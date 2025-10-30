import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('📦 Post-build: Copying extension files...');

// Copy manifest.json to dist
const manifestSrc = 'public/manifest.json';
const manifestDest = 'dist/manifest.json';

if (existsSync(manifestSrc)) {
  copyFileSync(manifestSrc, manifestDest);
  console.log('✅ Copied manifest.json to dist/');
} else {
  console.error('❌ manifest.json not found in public/');
  process.exit(1);
}

// Copy icons if they exist
const icons = ['icon-16.png', 'icon-48.png', 'icon-128.png'];
let iconsCopied = 0;

icons.forEach(icon => {
  const iconSrc = join('public', icon);
  const iconDest = join('dist', icon);
  
  if (existsSync(iconSrc)) {
    copyFileSync(iconSrc, iconDest);
    iconsCopied++;
  }
});

if (iconsCopied === icons.length) {
  console.log(`✅ Copied ${iconsCopied} icon files to dist/`);
} else {
  console.warn(`⚠️  Only ${iconsCopied}/${icons.length} icons found. See public/ICONS.md for instructions.`);
}

// Copy background.js (service worker)
const backgroundSrc = 'src/background.js';
const backgroundDest = 'dist/background.js';

if (existsSync(backgroundSrc)) {
  copyFileSync(backgroundSrc, backgroundDest);
  console.log('✅ Copied background.js to dist/');
} else {
  console.error('❌ background.js not found in src/');
  process.exit(1);
}

// Copy content.js (content script)
const contentSrc = 'src/content.js';
const contentDest = 'dist/content.js';

if (existsSync(contentSrc)) {
  copyFileSync(contentSrc, contentDest);
  console.log('✅ Copied content.js to dist/');
} else {
  console.error('❌ content.js not found in src/');
  process.exit(1);
}

// Copy offscreen.html
const offscreenHtmlSrc = 'src/offscreen.html';
const offscreenHtmlDest = 'dist/offscreen.html';

if (existsSync(offscreenHtmlSrc)) {
  copyFileSync(offscreenHtmlSrc, offscreenHtmlDest);
  console.log('✅ Copied offscreen.html to dist/');
} else {
  console.error('❌ offscreen.html not found in src/');
  process.exit(1);
}

// Copy offscreen.js (will be bundled by Vite, but we need the source for now)
// Note: offscreen.js needs to be built separately as it's a module
console.log('⚠️  Note: offscreen.js needs to be bundled separately');

console.log('\n✨ Extension build complete!');
console.log('📁 Load the "dist" folder in Chrome as an unpacked extension.');
