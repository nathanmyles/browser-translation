// Simple script to create placeholder PNG icons
// In production, you'd want to use proper icon generation tools

import { writeFileSync } from 'fs';

const sizes = [16, 48, 128];

const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="#4F46E5"/>
  <circle cx="64" cy="64" r="40" fill="white" fill-opacity="0.1"/>
  <text x="64" y="85" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle">🌐</text>
</svg>
`;

sizes.forEach(size => {
  const svg = createIconSVG(size);
  writeFileSync(`public/icon-${size}.svg`, svg);
  console.log(`Created icon-${size}.svg`);
});

console.log('\nNote: For production, convert these SVG files to PNG using a tool like:');
console.log('- ImageMagick: convert icon.svg -resize 128x128 icon-128.png');
console.log('- Online converter: https://cloudconvert.com/svg-to-png');
console.log('- Or use a proper icon generation tool');
