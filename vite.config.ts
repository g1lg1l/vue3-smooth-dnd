import { defineConfig } from 'vite'
import pkg from './package.json'

const banner = `/*! ${pkg.name} v${pkg.version} | MIT | https://github.com/g1lg1l/vue3-smooth-dnd
 * bundles smooth-dnd (MIT, Copyright (c) 2018 Kutlu Sahin) */`

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Vue3SmoothDnD',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) =>
        format === 'es'
          ? 'vue3-smooth-dnd.js'
          : format === 'cjs'
            ? 'vue3-smooth-dnd.cjs'
            : 'vue3-smooth-dnd.umd.cjs',
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: { globals: { vue: 'Vue' }, exports: 'named', banner },
    },
  },
})
