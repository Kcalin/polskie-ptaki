import { defineConfig } from 'vite'

export default defineConfig({
  base: '/skrzydla-nad-polska/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
  },
})
