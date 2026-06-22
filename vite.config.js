import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/api/,
            '/macros/s/AKfycbyokQ0HXWqPMtGzM7hyo5aOkUeY_NkEbIIXHSjZ8SL-jMwIDieUVVmqZXf85S3ahWY_/exec'
          )
      }
    }
  }
})