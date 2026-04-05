import { defineConfig } from 'vite'

export default defineConfig({
  base: '/polskie-ptaki/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
  },
})
