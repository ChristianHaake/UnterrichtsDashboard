/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // Split only the large eager dependencies into cacheable vendor chunks.
          // Everything else (e.g. qrcode) stays with its lazy widget chunk.
          if (id.includes('react-grid-layout') || id.includes('react-resizable')) return 'vendor-grid'
          if (id.includes('dexie')) return 'vendor-dexie'
          if (id.includes('react-dom')) return 'vendor-react'
          if (id.includes('i18next')) return 'vendor-i18n'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
