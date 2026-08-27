import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para Roboflow Serverless Workflows — evita CORS
      '/api/roboflow-workflow': {
        target: 'https://serverless.roboflow.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/roboflow-workflow/, ''),
      },
      // Proxy para Roboflow classify/detect — evita CORS
      '/api/roboflow-classify': {
        target: 'https://classify.roboflow.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/roboflow-classify/, ''),
      },
      '/api/roboflow-detect': {
        target: 'https://detect.roboflow.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/roboflow-detect/, ''),
      },
    },
  },
})
