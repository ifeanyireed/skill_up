import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-puzzlepro-index',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist')
        const puzzleproDir = resolve(distDir, 'puzzlepro')
        if (!fs.existsSync(puzzleproDir)) {
          fs.mkdirSync(puzzleproDir, { recursive: true })
        }
        const puzzleproHtml = resolve(distDir, 'puzzlepro.html')
        if (fs.existsSync(puzzleproHtml)) {
          fs.copyFileSync(puzzleproHtml, resolve(puzzleproDir, 'index.html'))
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        puzzlepro: resolve(__dirname, 'puzzlepro.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
})
