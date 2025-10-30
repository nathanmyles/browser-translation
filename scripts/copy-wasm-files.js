import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📦 Copying WASM files for Chrome extension...');

// Source: node_modules/@huggingface/transformers/dist
const sourceDir = join(__dirname, '..', 'node_modules', '@huggingface', 'transformers', 'dist');
const destDir = join(__dirname, '..', 'dist', 'assets');

if (!existsSync(sourceDir)) {
  console.error('❌ Source directory not found:', sourceDir);
  console.error('   Make sure @huggingface/transformers is installed');
  process.exit(1);
}

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

// Copy all WASM and related files
const filesToCopy = [
  'ort-wasm-simd-threaded.jsep.wasm',
  'ort-wasm-simd-threaded.wasm',
  'ort-wasm-simd.wasm',
  'ort-wasm-threaded.wasm',
  'ort-wasm.wasm',
  'ort-wasm-simd-threaded.jsep.mjs',
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd.mjs',
  'ort-wasm-threaded.mjs',
  'ort-wasm.mjs'
];

let copiedCount = 0;

filesToCopy.forEach(file => {
  const src = join(sourceDir, file);
  const dest = join(destDir, file);
  
  if (existsSync(src)) {
    try {
      copyFileSync(src, dest);
      console.log(`✅ Copied ${file}`);
      copiedCount++;
    } catch (err) {
      console.warn(`⚠️  Failed to copy ${file}:`, err.message);
    }
  } else {
    console.warn(`⚠️  File not found: ${file}`);
  }
});

console.log(`\n✨ Copied ${copiedCount}/${filesToCopy.length} WASM files to dist/assets/`);

if (copiedCount === 0) {
  console.error('\n❌ No WASM files were copied. Extension may not work properly.');
  process.exit(1);
}
