import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't empty the dist folder
    rollupOptions: {
      input: {
        offscreen: 'src/offscreen.js'
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es'
      }
    }
  }
})
