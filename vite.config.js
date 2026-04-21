import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute base path matching the GitHub Pages project URL so that all
  // asset references in the built index.html use unambiguous absolute paths
  // (e.g. /all-seeing-glass/assets/…) regardless of trailing-slash behaviour.
  base: '/all-seeing-glass/',
  server: { 
    port: 3000, 
    open: true 
  }
})
