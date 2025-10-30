import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verifying Chrome Extension Build...\n');

let errors = 0;
let warnings = 0;

// Check dist folder exists
if (!existsSync('dist')) {
  console.error('❌ dist/ folder not found. Run: npm run build:extension');
  process.exit(1);
}

// Check manifest.json
const manifestPath = 'dist/manifest.json';
if (existsSync(manifestPath)) {
  console.log('✅ manifest.json found');
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    
    // Check required fields
    if (!manifest.manifest_version) {
      console.error('❌ manifest.json missing manifest_version');
      errors++;
    }
    if (!manifest.name) {
      console.error('❌ manifest.json missing name');
      errors++;
    }
    if (!manifest.version) {
      console.error('❌ manifest.json missing version');
      errors++;
    }
    
    // Check icons
    if (manifest.icons) {
      const iconSizes = Object.keys(manifest.icons);
      iconSizes.forEach(size => {
        const iconPath = join('dist', manifest.icons[size]);
        if (existsSync(iconPath)) {
          console.log(`✅ Icon ${size}x${size} found`);
        } else {
          console.warn(`⚠️  Icon ${size}x${size} missing: ${manifest.icons[size]}`);
          warnings++;
        }
      });
    } else {
      console.warn('⚠️  No icons defined in manifest.json (Chrome will use default)');
      warnings++;
    }
  } catch (e) {
    console.error('❌ manifest.json is invalid JSON:', e.message);
    errors++;
  }
} else {
  console.error('❌ manifest.json not found in dist/');
  errors++;
}

// Check index.html
if (existsSync('dist/index.html')) {
  console.log('✅ index.html found');
} else {
  console.error('❌ index.html not found in dist/');
  errors++;
}

// Check assets folder
if (existsSync('dist/assets')) {
  console.log('✅ assets/ folder found');
} else {
  console.error('❌ assets/ folder not found in dist/');
  errors++;
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log('✨ Extension build is ready!');
  console.log('\nNext steps:');
  console.log('1. Open Chrome → chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log('4. Select the "dist" folder');
} else {
  if (errors > 0) {
    console.error(`\n❌ Found ${errors} error(s)`);
  }
  if (warnings > 0) {
    console.warn(`⚠️  Found ${warnings} warning(s)`);
  }
  
  if (warnings > 0 && errors === 0) {
    console.log('\n✅ Extension should still work, but consider fixing warnings.');
  } else {
    console.log('\n❌ Please fix errors before loading the extension.');
    process.exit(1);
  }
}
