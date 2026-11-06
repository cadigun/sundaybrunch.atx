import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const webDir = import.meta.dirname

export default defineConfig({
  root: resolve(webDir, '../admin'),
  cacheDir: resolve(webDir, 'node_modules/.vite-admin'),
  plugins: [react()],
  resolve: {
    alias: {
      react: resolve(webDir, 'node_modules/react'),
      'react-dom/client': resolve(webDir, 'node_modules/react-dom/client.js'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 4174,
    strictPort: true,
    proxy: {
      '/admin': {
        target: 'http://127.0.0.1:8790',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
    },
  },
})
