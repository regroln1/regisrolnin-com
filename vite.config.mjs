// vite.config.mjs
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    mimeTypes: {
      'text/plain': ['txt']
    },
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  }
})
