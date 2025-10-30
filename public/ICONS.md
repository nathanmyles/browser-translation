# Extension Icons

This directory needs PNG icons for the Chrome extension.

## Required Icons

- `icon-16.png` - 16x16 pixels (toolbar icon)
- `icon-48.png` - 48x48 pixels (extension management page)
- `icon-128.png` - 128x128 pixels (Chrome Web Store)

## Quick Setup

### Option 1: Use Placeholder Icons (for development)

You can temporarily use the SVG icon by converting it to PNG:

```bash
# Using ImageMagick (if installed)
convert icon.svg -resize 16x16 icon-16.png
convert icon.svg -resize 48x48 icon-48.png
convert icon.svg -resize 128x128 icon-128.png
```

### Option 2: Online Converter

1. Go to https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Convert to PNG at each size (16x16, 48x48, 128x128)
4. Save as `icon-16.png`, `icon-48.png`, `icon-128.png`

### Option 3: Create Custom Icons

Design your own icons using:
- Figma
- Adobe Illustrator
- Inkscape
- Canva

Make sure they're PNG format at the required sizes.

## Temporary Workaround

If you don't have icons yet, you can modify `manifest.json` to remove the icons section temporarily (Chrome will use a default icon).
