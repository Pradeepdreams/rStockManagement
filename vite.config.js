import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // or '0.0.0.0'
    allowedHosts: ['every-clouds-pay.loca.lt'],
    proxy: {
      '/api': {
        target: 'https://every-clouds-pay.loca.lt/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

