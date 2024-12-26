import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost',
        target: 'https://api.mirvitaminok.ru',
        changeOrigin: true,
        secure: true
      }
    },
    port: 5000,
  },
})
