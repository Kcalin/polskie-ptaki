import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
  },
}))
