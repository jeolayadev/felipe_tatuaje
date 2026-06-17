import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/felipe_tatuaje/',
  plugins: [react()],
  build: {
    cssMinify: false,
  }
})
