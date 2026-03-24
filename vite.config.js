import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        // ✅ manualChunks como FUNCIÓN (compatible con Rolldown)
        manualChunks(id) {
          // Crear chunk 'vendor' para dependencias principales
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
          }
          // undefined = dejar que Rolldown decida automáticamente
        }
      }
    }
  }
})