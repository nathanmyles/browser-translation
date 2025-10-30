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

console.log('\n✨ Extension build complete!');
console.log('📁 Load the "dist" folder in Chrome as an unpacked extension.');
