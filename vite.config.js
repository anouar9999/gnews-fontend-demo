import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Set VITE_BACKEND_URL in .env.local to point to the machine that runs Django.
  // Example: VITE_BACKEND_URL=http://192.168.1.50:8000
  const BACKEND = env.VITE_BACKEND_URL || 'http://localhost:8000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api':   { target: BACKEND, changeOrigin: true },
        '/media': { target: BACKEND, changeOrigin: true },
      },
    },
  }
})
