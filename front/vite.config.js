import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/dev.batko.it-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/dev.batko.it.pem')),
    },
    host: 'dev.batko.it',
    port: 5173,
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
