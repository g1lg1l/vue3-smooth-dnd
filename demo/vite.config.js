import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// The demo runs against the library source, so edits in ../src show up with HMR and no build step.
// Relative base: the build works at the domain root, under /vue3-smooth-dnd/ on GitHub Pages, or from a folder.
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { 'vue3-smooth-dnd': fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
    dedupe: ['vue'],
  },
})
